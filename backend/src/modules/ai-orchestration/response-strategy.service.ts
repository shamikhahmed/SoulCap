import { Injectable } from '@nestjs/common';
import { EmotionalState, AIMode, ResponseStrategy, LmmSummary } from '../living-mind/living-mind.types';
import { SafetyAssessment } from '../safety/safety.service';

export interface StrategySelection {
  mode: AIMode;
  strategy: ResponseStrategy;
  modeRationale: string;
  strategyRationale: string;
}

@Injectable()
export class ResponseStrategyService {
  select(opts: {
    emotionalState: EmotionalState;
    safetyAssessment: SafetyAssessment;
    lmm: LmmSummary;
    sessionTurnCount: number;
    userMessage: string;
  }): StrategySelection {
    const { emotionalState, safetyAssessment, lmm, sessionTurnCount, userMessage } = opts;

    // Safety always overrides
    if (safetyAssessment.requiresModeOverride && safetyAssessment.overrideMode) {
      return {
        mode: safetyAssessment.overrideMode,
        strategy: safetyAssessment.overrideStrategy ?? ResponseStrategy.GROUND,
        modeRationale: `Safety tier ${safetyAssessment.tier} detected — mandatory override`,
        strategyRationale: 'Crisis protocol active',
      };
    }

    const mode = this.selectMode(emotionalState, lmm, sessionTurnCount, userMessage);
    const strategy = this.selectStrategy(mode, emotionalState, lmm, sessionTurnCount);

    return {
      mode,
      strategy,
      modeRationale: this.explainModeSelection(mode, emotionalState),
      strategyRationale: this.explainStrategySelection(strategy, mode, sessionTurnCount),
    };
  }

  private selectMode(
    state: EmotionalState,
    lmm: LmmSummary,
    turnCount: number,
    message: string,
  ): AIMode {
    const { valence, arousal, intensity } = state;
    const msgLower = message.toLowerCase();

    // High distress → SUPPORT
    if (valence < -0.5 && intensity > 0.6) return AIMode.SUPPORT;
    if (arousal > 0.8 && valence < -0.3) return AIMode.SUPPORT;

    // Explicit guidance requests → COACHING
    const coachingSignals = ['what should', 'how do i', 'what can i do', 'help me', 'advice', 'suggest', 'plan', 'strategy'];
    if (coachingSignals.some((s) => msgLower.includes(s))) return AIMode.COACHING;

    // Questions about self → REFLECTION
    const reflectionSignals = ['why do i', 'why am i', 'why do i always', 'i keep', 'i always', 'pattern', 'notice that'];
    if (reflectionSignals.some((s) => msgLower.includes(s))) return AIMode.REFLECTION;

    // Early sessions with stable state → SUPPORT to build trust
    if (lmm.totalInteractions < 10 && valence >= -0.3) return AIMode.SUPPORT;

    // Moderate negative state → SUPPORT
    if (valence < -0.2) return AIMode.SUPPORT;

    // Neutral/positive state with established relationship → REFLECTION by default
    if (lmm.totalInteractions >= 10 && valence >= -0.2) return AIMode.REFLECTION;

    return AIMode.SUPPORT;
  }

  private selectStrategy(
    mode: AIMode,
    state: EmotionalState,
    lmm: LmmSummary,
    turnCount: number,
  ): ResponseStrategy {
    const { valence, arousal, intensity } = state;

    if (mode === AIMode.CRISIS) return ResponseStrategy.GROUND;

    if (mode === AIMode.SUPPORT) {
      // First turn of high distress: pure witnessing
      if (intensity > 0.7 && turnCount <= 1) return ResponseStrategy.WITNESS;
      // Moderate distress: reflect feelings back
      if (valence < -0.3) return ResponseStrategy.REFLECT;
      // Lower intensity: start exploring
      return ResponseStrategy.EXPLORE;
    }

    if (mode === AIMode.COACHING) {
      // Check what has worked for this person before
      const bestStrategies = Object.entries(lmm.interventionEffectiveness)
        .filter(([s, v]) => v.avgScore > 0.65 && [ResponseStrategy.ACTIVATE, ResponseStrategy.REFRAME, ResponseStrategy.EDUCATE].includes(s as ResponseStrategy))
        .sort(([, a], [, b]) => b.avgScore - a.avgScore);

      if (bestStrategies.length > 0) return bestStrategies[0][0] as ResponseStrategy;
      return ResponseStrategy.ACTIVATE;
    }

    if (mode === AIMode.REFLECTION) {
      // Enough interactions to surface a pattern
      if (lmm.totalInteractions >= 20 && lmm.confidenceScore > 0.4 && Math.random() < 0.3) {
        return ResponseStrategy.PATTERN;
      }
      // Metacognitive awareness is growing — use challenge
      if (lmm.cognitive.metacognitiveAwareness > 0.5 && Math.random() < 0.2) {
        return ResponseStrategy.CHALLENGE;
      }
      return ResponseStrategy.EXPLORE;
    }

    return ResponseStrategy.REFLECT;
  }

  private explainModeSelection(mode: AIMode, state: EmotionalState): string {
    const reasons: Record<AIMode, string> = {
      [AIMode.SUPPORT]: `Valence ${state.valence.toFixed(2)}, arousal ${state.arousal.toFixed(2)} — person needs empathic presence`,
      [AIMode.COACHING]: 'User message signals readiness for guidance or action',
      [AIMode.REFLECTION]: 'Stable state with established relationship — reflection supports growth',
      [AIMode.CRISIS]: 'Safety signals detected — crisis protocol',
    };
    return reasons[mode];
  }

  private explainStrategySelection(strategy: ResponseStrategy, mode: AIMode, turnCount: number): string {
    return `${strategy} selected for ${mode} mode at turn ${turnCount}`;
  }
}
