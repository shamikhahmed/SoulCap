import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AIMode, ResponseStrategy, EmotionalState } from '../living-mind/living-mind.types';
import { InterventionStrategy, AIMode as PrismaAIMode, SafetyTier } from '@prisma/client';

@Injectable()
export class InterventionEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async recordIntervention(
    userId: string,
    organizationId: string,
    opts: {
      strategy: ResponseStrategy;
      threadId?: string;
      emotionalState: EmotionalState;
      mode: AIMode;
      trustLevel: number;
    },
  ) {
    return this.prisma.intervention.create({
      data: {
        userId,
        organizationId,
        strategy: opts.strategy as unknown as InterventionStrategy,
        mode: opts.mode as unknown as PrismaAIMode,
        threadId: opts.threadId ?? null,
        contextEmotionalState: opts.emotionalState as object,
        contextTrustLevel: opts.trustLevel,
      },
    });
  }

  async recordOutcome(
    interventionId: string,
    outcome: {
      immediateEngagement?: number;
      sessionContinuation?: number;
      userFeedback?: string;
    },
  ) {
    const scores = [outcome.immediateEngagement, outcome.sessionContinuation].filter(
      (s) => s !== undefined,
    ) as number[];
    const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : undefined;

    return this.prisma.intervention.update({
      where: { id: interventionId },
      data: {
        immediateEngagement: outcome.immediateEngagement,
        sessionContinuation: outcome.sessionContinuation,
        userFeedback: outcome.userFeedback,
        overallScore,
        scoredAt: new Date(),
      },
    });
  }

  estimateTrustLevel(totalInteractions: number, modelConfidence: number): number {
    const interactionScore = Math.min(1, totalInteractions / 50);
    return interactionScore * 0.6 + modelConfidence * 0.4;
  }

  buildEpisodeSummary(userMessage: string, aiResponse: string, topics: string[]): string {
    const u = userMessage.length > 300 ? userMessage.slice(0, 300) + '…' : userMessage;
    const a = aiResponse.length > 200 ? aiResponse.slice(0, 200) + '…' : aiResponse;
    return `User: ${u} | Companion: ${a} | Topics: ${topics.join(', ')}`;
  }
}
