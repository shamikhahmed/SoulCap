import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LivingMindService } from '../living-mind/living-mind.service';
import { MemoryService } from '../memory/memory.service';
import { BeliefNodesService } from '../memory/belief-nodes.service';
import { EmotionalAnalysisService } from '../emotional-analysis/emotional-analysis.service';
import { SafetyService } from '../safety/safety.service';
import { ResponseStrategyService } from './response-strategy.service';
import { InterventionEngineService } from './intervention-engine.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AIMode, ResponseStrategy, OrchestrationResult } from '../living-mind/living-mind.types';

export interface OrchestrateInput {
  userId: string;
  organizationId: string;
  sessionId: string;
  userMessage: string;
  sessionHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  sessionTurnCount: number;
}

@Injectable()
export class AiOrchestrationService {
  private readonly logger = new Logger(AiOrchestrationService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly livingMindService: LivingMindService,
    private readonly memoryService: MemoryService,
    private readonly beliefNodesService: BeliefNodesService,
    private readonly emotionalAnalysisService: EmotionalAnalysisService,
    private readonly safetyService: SafetyService,
    private readonly responseStrategyService: ResponseStrategyService,
    private readonly interventionEngineService: InterventionEngineService,
    private readonly prisma: PrismaService,
  ) {}

  async orchestrate(input: OrchestrateInput): Promise<OrchestrationResult> {
    const { userId, organizationId, userMessage, sessionTurnCount } = input;

    const analysis = await this.emotionalAnalysisService.analyze(userMessage);
    const { emotionalState, safetySignals } = analysis;

    const safetyAssessment = this.safetyService.assess(safetySignals, userMessage);

    const lmm = await this.livingMindService.getSummary(userId, organizationId);

    if (safetyAssessment.tier === 3 && safetyAssessment.protocolResponse) {
      return {
        content: safetyAssessment.protocolResponse,
        mode: AIMode.CRISIS,
        strategy: ResponseStrategy.RESOURCE,
        safetyTier: 3,
        explainability: {
          detectedEmotions: emotionalState,
          selectedMode: AIMode.CRISIS,
          selectedStrategy: ResponseStrategy.RESOURCE,
          modeRationale: 'Tier-3 safety override',
          strategyRationale: 'Crisis protocol',
          memoriesUsed: 0,
          modelConfidence: lmm.confidenceScore,
        },
      };
    }

    void this.beliefNodesService.inferFromEmotionalEvent(userId, organizationId, {
      emotionType: emotionalState.dominantEmotions[0] ?? 'unknown',
      trigger: analysis.topics[0],
      frequency: 1,
    });

    return {
      content: '',
      mode: AIMode.SUPPORT,
      strategy: ResponseStrategy.WITNESS,
      safetyTier: safetyAssessment.tier,
      explainability: {
        detectedEmotions: emotionalState,
        selectedMode: AIMode.SUPPORT,
        selectedStrategy: ResponseStrategy.WITNESS,
        modeRationale: 'Default support mode',
        strategyRationale: 'Witnessing',
        memoriesUsed: 0,
        modelConfidence: lmm.confidenceScore,
      },
    };
  }
}
