import { AIMode, InterventionStrategy, SafetyTier } from '../../common/types';

// ─── LMM Update ──────────────────────────────────────────────────────────────

export interface UpdateLmmJobData {
  userId: string;
  organizationId: string;
  emotionalState: {
    valence: number;
    arousal: number;
    groundedness: number;
    dominantEmotions: string[];
    intensity: number;
  };
  strategyUsed: InterventionStrategy;
  implicitScore?: number;
  contextThreadId?: string;
}

export interface SnapshotLmmJobData {
  userId: string;
  organizationId: string;
  triggerReason: string;
}

export interface UpdateTraitsJobData {
  userId: string;
  organizationId: string;
  traits: Partial<{
    emotionalGranularity: number;
    metacognitiveAwareness: number;
    locusOfControl: number;
    attachmentStyle: string;
    resilience: number;
    selfCompassion: number;
  }>;
  evidence: string;
}

// ─── Memory ───────────────────────────────────────────────────────────────────

export interface StoreEpisodeJobData {
  userId: string;
  organizationId: string;
  threadId: string;
  contentSummary: string;
  topics: string[];
  keywords: string[];
  emotionalValence: number;
  arousalLevel: number;
  groundednessLevel: number;
  dominantEmotions: string[];
  relationshipsMentioned: string[];
  emotionalSalience: number;
  messageId?: string;
}

export interface UpdateMemoryDecayJobData {
  userId: string;
  organizationId: string;
}

export interface GenerateMemoryEmbeddingJobData {
  memoryItemId: string;
  userId: string;
  content: string;
}

export interface ClusterMemoriesJobData {
  userId: string;
  organizationId: string;
}

// ─── Emotion ──────────────────────────────────────────────────────────────────

export interface AnalyzeEmotionJobData {
  userId: string;
  organizationId: string;
  content: string;
  sourceType: string;
  sourceId: string;
}

export interface CreateEmotionalEventJobData {
  userId: string;
  organizationId: string;
  emotionType: string;
  valence: number;
  arousal: number;
  intensity: number;
  trigger?: string;
  context?: string;
  source: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

// ─── Pattern ──────────────────────────────────────────────────────────────────

export interface DetectPatternsJobData {
  userId: string;
  organizationId: string;
  recentEpisodeIds: string[];
  triggerEmotionType?: string;
}

export interface ConfirmPatternJobData {
  patternId: string;
  userId: string;
  evidenceId: string;
  confidence: number;
}

// ─── Insight ──────────────────────────────────────────────────────────────────

export interface GenerateInsightJobData {
  userId: string;
  organizationId: string;
  triggerType: string;
  contextIds: string[];
  forceGenerate?: boolean;
}

export interface GenerateGrowthReportJobData {
  userId: string;
  organizationId: string;
  reportType: 'weekly' | 'monthly' | 'annual';
  periodStart: string;
  periodEnd: string;
}

// ─── Prediction ───────────────────────────────────────────────────────────────

export interface RunPredictionsJobData {
  userId: string;
  organizationId: string;
}

export interface EvaluatePredictionJobData {
  predictionId: string;
  userId: string;
  actualValue: unknown;
}

// ─── Voice ────────────────────────────────────────────────────────────────────

export interface TranscribeVoiceJobData {
  voiceNoteId: string;
  userId: string;
  organizationId: string;
  fileId: string;
  storageKey: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface SendPushJobData {
  userId: string;
  notificationId: string;
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
}

export interface SendEmailJobData {
  userId: string;
  email: string;
  templateId: string;
  variables: Record<string, unknown>;
}

// ─── Embedding ────────────────────────────────────────────────────────────────

export interface GenerateEmbeddingJobData {
  entityType: 'message' | 'memory' | 'insight' | 'pattern';
  entityId: string;
  content: string;
  userId: string;
}

// ─── Safety ───────────────────────────────────────────────────────────────────

export interface EscalateSafetyJobData {
  userId: string;
  organizationId: string;
  safetyFlagId: string;
  tier: SafetyTier;
  signals: string[];
}

// ─── AI Completion ────────────────────────────────────────────────────────────

export interface AiCompletionJobData {
  userId: string;
  organizationId: string;
  threadId: string;
  messageId: string;
  mode: AIMode;
  strategy: InterventionStrategy;
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export interface SyncStripeEventJobData {
  stripeEventId: string;
  type: string;
  data: unknown;
}
