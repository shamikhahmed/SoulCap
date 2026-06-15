import { Injectable, Logger } from '@nestjs/common';
import { PipelineContext, PipelineResult, AIMode, InterventionStrategy } from '../../common/types';
import { PipelineState } from './pipeline.interface';
import { SafetyGateService } from '../safety/safety-gate.service';
import { ModelRouterService } from '../router/model-router.service';
import { PromptBuilderService } from '../prompts/prompt-builder.service';
import { EMOTION_ANALYSIS_TOOL } from './steps/emotion-detection.step';

@Injectable()
export class AIPipelineService {
  private readonly logger = new Logger(AIPipelineService.name);

  constructor(
    private readonly safetyGate: SafetyGateService,
    private readonly router: ModelRouterService,
    private readonly promptBuilder: PromptBuilderService,
  ) {}

  async run(context: PipelineContext, lmmSummary: import('../../common/types').LmmSummary, memories: PipelineState['retrievedMemories']): Promise<PipelineResult> {
    const state: PipelineState = { context };
    const start = Date.now();

    // ── Quick scan (sync, before any API call) ────────────────────────────────
    state.quickScanTier = this.safetyGate.quickScan(context.userMessage);

    // ── Steps 1a + 1b run in parallel ────────────────────────────────────────
    const [analysisResult] = await Promise.allSettled([
      this.runEmotionAnalysis(context.userMessage),
    ]);

    if (analysisResult.status === 'fulfilled') {
      Object.assign(state, analysisResult.value);
    } else {
      // Fail-secure: emit tier 1, not 0
      state.emotionalState = { valence: 0, arousal: 0.5, groundedness: 0.7, dominantEmotions: [], intensity: 0.3, updatedAt: new Date().toISOString() };
      state.safetySignals = { crisisDetected: false, tier: 1, confidence: 0, signals: ['analysis_failed'] };
      state.mentionedRelationships = [];
      state.topics = [];
      state.keywords = [];
    }

    // ── Safety assessment ─────────────────────────────────────────────────────
    state.safetyAssessment = this.safetyGate.assess(state.safetySignals!, context.userMessage);
    state.lmmSummary = lmmSummary;
    state.retrievedMemories = memories;

    // ── Tier-3 early return ───────────────────────────────────────────────────
    if (state.safetyAssessment.tier === 3) {
      return this.buildCrisisResult(state, Date.now() - start);
    }

    // ── Strategy selection ────────────────────────────────────────────────────
    this.selectStrategy(state);

    // ── Prompt assembly ───────────────────────────────────────────────────────
    state.systemPrompt = this.promptBuilder.build({
      lmm: lmmSummary,
      memories: memories ?? [],
      mode: state.selectedMode!,
      strategy: state.selectedStrategy!,
      sessionTurnCount: context.sessionTurnCount,
    });

    // ── Response generation ───────────────────────────────────────────────────
    const genStart = Date.now();
    const response = await this.router.complete(
      {
        model: 'claude-sonnet-4-6',
        systemPrompt: state.systemPrompt,
        messages: [
          ...context.sessionHistory,
          { role: 'user', content: context.userMessage },
        ],
        maxTokens: 600,
      },
      { role: 'generation', userId: context.userId, organizationId: context.organizationId },
    );
    state.rawResponse = response.content;
    state.tokensUsed = response.inputTokens + response.outputTokens;
    state.latencyMs = Date.now() - genStart;

    // ── Hard rail check → auto-regenerate once ────────────────────────────────
    const violation = this.safetyGate.checkHardRails(state.rawResponse);
    if (violation) {
      this.logger.warn(`Hard rail violation: ${violation}. Regenerating.`);
      const retry = await this.router.complete(
        {
          model: 'claude-sonnet-4-6',
          systemPrompt: state.systemPrompt + '\n\n[STRICT OVERRIDE: Do not claim to be a therapist. Do not make clinical diagnoses. Rephrase without those elements.]',
          messages: [
            ...context.sessionHistory,
            { role: 'user', content: context.userMessage },
          ],
          maxTokens: 600,
        },
        { role: 'generation', userId: context.userId, organizationId: context.organizationId },
      );
      state.rawResponse = retry.content;
    }

    // ── Tier-2 resource append ────────────────────────────────────────────────
    state.finalResponse = this.safetyGate.appendTier2Resources(state.rawResponse, state.safetyAssessment.tier);

    return {
      content: state.finalResponse,
      mode: state.selectedMode!,
      strategy: state.selectedStrategy!,
      safetyTier: state.safetyAssessment.tier,
      tokensUsed: state.tokensUsed ?? 0,
      latencyMs: Date.now() - start,
      modelUsed: response.model,
      explainability: {
        emotionalState: state.emotionalState!,
        safetyAssessment: state.safetyAssessment,
        selectedMode: state.selectedMode!,
        selectedStrategy: state.selectedStrategy!,
        modeRationale: state.modeRationale ?? '',
        strategyRationale: state.strategyRationale ?? '',
        memoriesUsed: (memories ?? []).length,
        modelConfidence: lmmSummary.confidenceScore,
        interventionHistory: [],
      },
    };
  }

  private async runEmotionAnalysis(message: string): Promise<Partial<PipelineState>> {
    const result = await this.router.analyzeWithTool<{
      valence: number; arousal: number; groundedness: number;
      dominant_emotions: string[]; intensity: number;
      safety_signals: { crisis_detected: boolean; tier: number; confidence: number; signals: string[] };
      mentioned_relationships: string[]; topics: string[]; keywords: string[];
    }>(
      `Analyze the emotional content of this message from a wellness app user:\n\n"${message}"`,
      'analyze_emotional_content',
      EMOTION_ANALYSIS_TOOL,
    );

    return {
      emotionalState: {
        valence: Math.max(-1, Math.min(1, result.valence ?? 0)),
        arousal: Math.max(0, Math.min(1, result.arousal ?? 0.5)),
        groundedness: Math.max(0, Math.min(1, result.groundedness ?? 0.7)),
        dominantEmotions: result.dominant_emotions ?? [],
        intensity: Math.max(0, Math.min(1, result.intensity ?? 0.3)),
        updatedAt: new Date().toISOString(),
      },
      safetySignals: {
        crisisDetected: result.safety_signals?.crisis_detected ?? false,
        tier: (result.safety_signals?.tier ?? 0) as 0 | 1 | 2 | 3,
        confidence: result.safety_signals?.confidence ?? 0,
        signals: result.safety_signals?.signals ?? [],
      },
      mentionedRelationships: result.mentioned_relationships ?? [],
      topics: result.topics ?? [],
      keywords: result.keywords ?? [],
    };
  }

  private selectStrategy(state: PipelineState) {
    const { emotionalState, lmmSummary, safetyAssessment, context } = state;
    const { valence = 0, arousal = 0.5, intensity = 0.3 } = emotionalState ?? {};
    const { totalInteractions, confidenceScore, relational, cognitive, interventionEffectiveness } = lmmSummary!;
    const msg = context.userMessage.toLowerCase();

    // Safety always overrides
    if (safetyAssessment?.requiresOverride) {
      state.selectedMode = AIMode.CRISIS;
      state.selectedStrategy = InterventionStrategy.GROUND;
      state.modeRationale = `Safety tier ${safetyAssessment.tier} override`;
      state.strategyRationale = 'Crisis protocol active';
      return;
    }

    // Mode selection
    let mode: AIMode;
    if (valence < -0.5 && intensity > 0.6) {
      mode = AIMode.SUPPORT;
      state.modeRationale = 'High distress — empathic presence needed';
    } else if (['what should', 'how do i', 'advice', 'help me', 'suggest', 'plan'].some((s) => msg.includes(s))) {
      mode = AIMode.COACHING;
      state.modeRationale = 'Guidance-seeking language detected';
    } else if (['why do i', 'why am i', 'i keep', 'pattern', 'always'].some((s) => msg.includes(s))) {
      mode = AIMode.REFLECTION;
      state.modeRationale = 'Self-inquiry language detected';
    } else if (totalInteractions < 10 && valence >= -0.3) {
      mode = AIMode.SUPPORT;
      state.modeRationale = 'Early relationship — building trust';
    } else if (valence < -0.2) {
      mode = AIMode.SUPPORT;
      state.modeRationale = 'Moderate negative valence';
    } else if (totalInteractions >= 10 && relational.attachmentStyle !== 'avoidant') {
      mode = AIMode.REFLECTION;
      state.modeRationale = 'Established relationship — reflection supports growth';
    } else {
      mode = AIMode.SUPPORT;
      state.modeRationale = 'Default — empathic presence';
    }
    state.selectedMode = mode;

    // Strategy selection
    let strategy: InterventionStrategy;
    if (mode === AIMode.SUPPORT) {
      if (intensity > 0.7 && context.sessionTurnCount <= 1) {
        strategy = InterventionStrategy.WITNESS;
      } else if (valence < -0.3) {
        strategy = InterventionStrategy.REFLECT;
      } else {
        strategy = InterventionStrategy.EXPLORE;
      }
    } else if (mode === AIMode.COACHING) {
      const best = Object.entries(interventionEffectiveness ?? {})
        .filter(([s, v]) => v.avgScore > 0.65 && ['ACTIVATE','REFRAME','EDUCATE'].includes(s))
        .sort(([, a], [, b]) => b.avgScore - a.avgScore);
      strategy = best.length > 0 ? (best[0][0] as InterventionStrategy) : InterventionStrategy.ACTIVATE;
    } else if (mode === AIMode.REFLECTION) {
      const readyForPattern = totalInteractions >= 20 && confidenceScore > 0.4 && intensity < 0.5;
      const readyForChallenge = cognitive.metacognitiveAwareness > 0.5 && totalInteractions >= 15;
      if (readyForPattern) {
        strategy = InterventionStrategy.PATTERN;
      } else if (readyForChallenge) {
        strategy = InterventionStrategy.CHALLENGE;
      } else {
        strategy = InterventionStrategy.EXPLORE;
      }
    } else {
      strategy = InterventionStrategy.GROUND;
    }
    state.selectedStrategy = strategy;
    state.strategyRationale = `${strategy} selected for ${mode} at turn ${context.sessionTurnCount}`;
  }

  private buildCrisisResult(state: PipelineState, latencyMs: number): PipelineResult {
    return {
      content: state.safetyAssessment!.protocolResponse!,
      mode: AIMode.CRISIS,
      strategy: InterventionStrategy.RESOURCE,
      safetyTier: 3,
      tokensUsed: 0,
      latencyMs,
      modelUsed: 'hardcoded',
      explainability: {
        emotionalState: state.emotionalState!,
        safetyAssessment: state.safetyAssessment!,
        selectedMode: AIMode.CRISIS,
        selectedStrategy: InterventionStrategy.RESOURCE,
        modeRationale: 'Tier-3 safety protocol',
        strategyRationale: 'Hardcoded crisis response — LLM bypassed',
        memoriesUsed: 0,
        modelConfidence: 0,
        interventionHistory: [],
      },
    };
  }
}
