import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { InterventionStrategy, AIMode, SafetyTier } from '@prisma/client';

@Injectable()
export class InterventionService {
  constructor(private readonly prisma: PrismaService) {}

  async logIntervention(
    userId: string,
    organizationId: string,
    data: {
      strategy: InterventionStrategy;
      mode: AIMode;
      threadId?: string;
      safetyTier?: SafetyTier;
      emotionalState: object;
      trustLevel: number;
    },
  ) {
    return this.prisma.intervention.create({
      data: {
        userId,
        organizationId,
        strategy: data.strategy,
        mode: data.mode,
        threadId: data.threadId ?? null,
        contextEmotionalState: data.emotionalState,
        contextSafetyTier: data.safetyTier ?? SafetyTier.NONE,
        contextTrustLevel: data.trustLevel,
      },
    });
  }

  async recordOutcome(interventionId: string, score: number, feedback?: string) {
    return this.prisma.intervention.update({
      where: { id: interventionId },
      data: { overallScore: score, userFeedback: feedback, scoredAt: new Date() },
    });
  }

  async getUserHistory(userId: string, organizationId: string, limit = 20) {
    return this.prisma.intervention.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getCopingMechanisms(userId: string, organizationId: string) {
    return this.prisma.copingMechanism.findMany({
      where: { userId, organizationId, deletedAt: null },
      orderBy: [{ effectiveness: 'desc' }, { usageFrequency: 'desc' }],
    });
  }

  async addCopingMechanism(
    userId: string,
    organizationId: string,
    data: { name: string; description?: string; category: string; isHealthy?: boolean },
  ) {
    return this.prisma.copingMechanism.create({
      data: { userId, organizationId, ...data, isHealthy: data.isHealthy ?? true },
    });
  }

  async rateCopingMechanism(id: string, userId: string, effectiveness: number) {
    return this.prisma.copingMechanism.update({
      where: { id },
      data: {
        effectiveness,
        userRated: true,
        usageFrequency: { increment: 1 },
      },
    });
  }

  async getSuggestedActivities(userId: string, organizationId: string) {
    return this.prisma.activityRecommendation.findMany({
      where: { userId, organizationId, completed: false, expiresAt: { gt: new Date() } },
      include: { activity: true },
      orderBy: { score: 'desc' },
      take: 5,
    });
  }

  async completeActivity(recommendationId: string, userId: string, feedback?: string) {
    return this.prisma.activityRecommendation.update({
      where: { id: recommendationId },
      data: { completed: true, completedAt: new Date(), feedback: feedback ?? null },
    });
  }

  async getTriggers(userId: string, organizationId: string) {
    return this.prisma.trigger.findMany({
      where: { userId, organizationId, isActive: true, deletedAt: null },
      orderBy: [{ frequency: 'desc' }, { intensity: 'desc' }],
    });
  }

  async addTrigger(
    userId: string,
    organizationId: string,
    data: { name: string; category: string; description?: string; intensity?: number },
  ) {
    return this.prisma.trigger.create({
      data: { userId, organizationId, ...data, intensity: data.intensity ?? 0.5 },
    });
  }
}
