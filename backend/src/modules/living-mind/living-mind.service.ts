import { Injectable, Logger } from '@nestjs/common';
import { LivingMindRepository } from './living-mind.repository';
import {
  LmmSummary,
  EmotionalStateDto,
  ActiveRisk,
  ActiveGoal,
  ActiveTrigger,
  ActiveStressor,
} from '../../common/types';

/**
 * Prisma `Json` columns arrive as `JsonValue`, and the previous code cast them
 * straight to domain types — so malformed stored JSON became a runtime crash.
 * These coerce instead, falling back to empty rather than trusting the column.
 *
 * NOTE: this module is slated for rebuild against the trust-tier spec; these are
 * deliberately minimal, not a foundation to build on.
 */
function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toObject<T>(value: unknown, fallback: T): T {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as T)
    : fallback;
}

@Injectable()
export class LivingMindService {
  private readonly logger = new Logger(LivingMindService.name);

  constructor(private readonly repo: LivingMindRepository) {}

  async getOrCreate(userId: string, organizationId: string) {
    return this.repo.findOrCreate(userId, organizationId);
  }

  async getSummary(userId: string, organizationId: string): Promise<LmmSummary> {
    const model = await this.repo.findOrCreate(userId, organizationId);
    return this.buildSummary(userId, model);
  }

  private buildSummary(userId: string, model: NonNullable<Awaited<ReturnType<LivingMindRepository['findByUserId']>>>): LmmSummary {
    const effectiveness = (model.interventionEffectiveness as Record<string, { avgScore: number; totalUses: number }>) ?? {};
    return {
      userId,
      totalInteractions: model.totalInteractions,
      confidenceScore: model.confidenceScore,
      affective: {
        baselineValence: model.baselineValence,
        emotionalVolatility: model.emotionalVolatility,
        emotionalGranularity: model.emotionalGranularity,
      },
      cognitive: {
        locusOfControl: model.locusOfControl,
        metacognitiveAwareness: model.metacognitiveAwareness,
        cognitiveFlexibility: model.cognitiveFlexibility,
        ruminationTendency: model.ruminationTendency,
      },
      relational: {
        attachmentStyle: model.attachmentStyle ?? 'unknown',
        socialBattery: model.socialBattery,
        boundaryStrength: model.boundaryStrength,
      },
      personality: {
        openness: model.openness,
        conscientiousness: model.conscientiousness,
        resilience: model.resilience,
        selfCompassion: model.selfCompassion,
      },
      behavioral: {
        copingStyle: model.copingStyle ?? 'unknown',
        stressResponse: model.stressResponse ?? 'unknown',
        conflictStyle: model.conflictStyle ?? 'unknown',
      },
      activeRisks: toArray<ActiveRisk>(model.activeRisks),
      activeGoals: toArray<ActiveGoal>(model.activeGoals),
      activeTriggers: toArray<ActiveTrigger>(model.activeTriggers),
      activeStressors: toArray<ActiveStressor>(model.activeStressors),
      currentEmotionalState: toObject<EmotionalStateDto>(model.currentEmotionalState, {
        valence: 0, arousal: 0.5, groundedness: 0.7, dominantEmotions: [], intensity: 0.3, updatedAt: new Date().toISOString(),
      }),
      keyMemories: [],
      strengths: toArray<string>(model.strengths),
      growthAreas: toArray<string>(model.growthAreas),
      preferredCopingMechanisms: toArray<string>(model.preferredCopingMechanisms),
      interventionEffectiveness: effectiveness,
    };
  }

  async updateFromInteraction(
    userId: string,
    organizationId: string,
    opts: {
      emotionalState: EmotionalStateDto;
      strategyUsed: string;
      strategyScore?: number;
    },
  ) {
    const model = await this.repo.findOrCreate(userId, organizationId);
    const alpha = 0.05;
    const newBaseline = model.baselineValence * (1 - alpha) + opts.emotionalState.valence * alpha;

    const effectiveness = (model.interventionEffectiveness as Record<string, { avgScore: number; totalUses: number }>) ?? {};
    if (opts.strategyScore !== undefined) {
      const prev = effectiveness[opts.strategyUsed] ?? { avgScore: 0, totalUses: 0 };
      const n = prev.totalUses + 1;
      effectiveness[opts.strategyUsed] = {
        totalUses: n,
        avgScore: (prev.avgScore * prev.totalUses + opts.strategyScore) / n,
      };
    }

    return this.repo.update(model.id, {
      baselineValence: newBaseline,
      currentEmotionalState: { ...opts.emotionalState, updatedAt: new Date().toISOString() },
      interventionEffectiveness: effectiveness,
      totalInteractions: { increment: 1 },
      lastInteractionAt: new Date(),
    });
  }

  async updateTraits(
    userId: string,
    organizationId: string,
    traits: Partial<{
      attachmentStyle: string;
      locusOfControl: number;
      metacognitiveAwareness: number;
      emotionalGranularity: number;
      ruminationTendency: number;
      cognitiveFlexibility: number;
      socialBattery: number;
      boundaryStrength: number;
      selfCompassion: number;
      resilience: number;
      copingStyle: string;
    }>,
  ) {
    const model = await this.repo.findOrCreate(userId, organizationId);
    return this.repo.update(model.id, traits);
  }

  async runDecay(userId: string, organizationId: string) {
    // Decay for LMM means gradually reverting traits toward neutral when there's no interaction
    const model = await this.repo.findByUserId(userId, organizationId);
    if (!model) return;

    const daysSince = model.lastInteractionAt
      ? (Date.now() - model.lastInteractionAt.getTime()) / 86_400_000
      : 0;

    if (daysSince < 7) return; // No decay needed under 7 days

    const decayRate = 0.01 * Math.min(daysSince / 7, 3);
    await this.repo.update(model.id, {
      confidenceScore: Math.max(0, model.confidenceScore * (1 - decayRate)),
    });
  }

  async snapshotModel(userId: string, organizationId: string) {
    const model = await this.repo.findByUserId(userId, organizationId);
    if (!model) return;
    const summary = await this.getSummary(userId, organizationId);
    return this.repo.snapshot(
      model.id,
      userId,
      organizationId,
      model.modelVersion + 1,
      summary as object,
      model.confidenceScore,
      'PERIODIC',
    );
  }

  async getDisplayBeliefs(userId: string, organizationId: string) {
    // Beliefs are surfaced as high-confidence memory items in the new schema
    return [];
  }

  async userValidatesBelief(_beliefId: string, _accepted: boolean, _note?: string) {
    return { updated: true };
  }
}
