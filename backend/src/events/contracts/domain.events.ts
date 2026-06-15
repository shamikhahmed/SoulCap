import { AIMode, InterventionStrategy, SafetyTier } from '../../common/types';

export class MessageReceivedEvent {
  static readonly EVENT = 'message.received';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly threadId: string,
    public readonly messageId: string,
    public readonly content: string,
  ) {}
}

export class MessageSentEvent {
  static readonly EVENT = 'message.sent';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly threadId: string,
    public readonly messageId: string,
    public readonly mode: AIMode,
    public readonly strategy: InterventionStrategy,
    public readonly safetyTier: SafetyTier,
  ) {}
}

export class MemoryCreatedEvent {
  static readonly EVENT = 'memory.created';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly memoryItemId: string,
    public readonly type: string,
    public readonly confidence: number,
  ) {}
}

export class MemoryUpdatedEvent {
  static readonly EVENT = 'memory.updated';
  constructor(
    public readonly userId: string,
    public readonly memoryItemId: string,
    public readonly previousConfidence: number,
    public readonly newConfidence: number,
    public readonly trigger: string,
  ) {}
}

export class EmotionDetectedEvent {
  static readonly EVENT = 'emotion.detected';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly valence: number,
    public readonly arousal: number,
    public readonly dominantEmotions: string[],
    public readonly intensity: number,
    public readonly sourceType: string,
    public readonly sourceId: string,
  ) {}
}

export class PatternDetectedEvent {
  static readonly EVENT = 'pattern.detected';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly patternId: string,
    public readonly patternType: string,
    public readonly confidence: number,
    public readonly isNew: boolean,
  ) {}
}

export class InsightGeneratedEvent {
  static readonly EVENT = 'insight.generated';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly insightId: string,
    public readonly insightType: string,
    public readonly confidence: number,
  ) {}
}

export class GoalCompletedEvent {
  static readonly EVENT = 'goal.completed';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly goalId: string,
    public readonly goalTitle: string,
    public readonly domain: string,
  ) {}
}

export class GoalMilestoneReachedEvent {
  static readonly EVENT = 'goal.milestone.reached';
  constructor(
    public readonly userId: string,
    public readonly goalId: string,
    public readonly milestoneId: string,
    public readonly milestoneTitle: string,
  ) {}
}

export class HabitStreakAchievedEvent {
  static readonly EVENT = 'habit.streak.achieved';
  constructor(
    public readonly userId: string,
    public readonly habitId: string,
    public readonly habitName: string,
    public readonly streakDays: number,
  ) {}
}

export class CheckInCompletedEvent {
  static readonly EVENT = 'check_in.completed';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly checkInId: string,
    public readonly valence: number,
    public readonly arousal: number,
    public readonly emotions: string[],
  ) {}
}

export class LmmUpdatedEvent {
  static readonly EVENT = 'lmm.updated';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly previousBaseline: number,
    public readonly newBaseline: number,
    public readonly confidenceScore: number,
    public readonly totalInteractions: number,
  ) {}
}

export class PhaseTransitionDetectedEvent {
  static readonly EVENT = 'lmm.phase_transition';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly shiftedDomains: string[],
    public readonly significanceScore: number,
  ) {}
}

export class PredictionCreatedEvent {
  static readonly EVENT = 'prediction.created';
  constructor(
    public readonly userId: string,
    public readonly predictionId: string,
    public readonly type: string,
    public readonly confidence: number,
  ) {}
}

export class GrowthReportGeneratedEvent {
  static readonly EVENT = 'report.growth.generated';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly reportId: string,
    public readonly reportType: string,
  ) {}
}
