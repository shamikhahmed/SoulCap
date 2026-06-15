// ─── Re-export Prisma enums for use across modules ───────────────────────────
export {
  AIMode,
  SafetyTier,
  InterventionStrategy,
  MemoryType,
  MemorySource,
  PatternType,
  PatternStatus,
  InsightType,
  RiskLevel,
  GoalStatus,
  GoalDomain,
  RelationshipType,
  HabitFrequency,
  HabitStatus,
  MembershipRole,
  PredictionType,
  NotificationType,
  SubscriptionTier,
  SubscriptionStatus,
  ThreadStatus,
  MessageRole,
  JobStatus,
  FileType,
  LifeEventCategory,
} from '@prisma/client';

// ─── Authenticated Request ────────────────────────────────────────────────────

export interface ClerkUserPayload {
  sub: string;          // Clerk user ID
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  orgId?: string;       // Active organization from Clerk session
  orgRole?: string;
}

export interface AuthenticatedUser {
  id: string;           // DB user ID
  clerkId: string;
  email: string;
  organizationId: string;
  role: string;
}

// ─── Emotional State ──────────────────────────────────────────────────────────

export interface EmotionalStateDto {
  valence: number;          // -1 to 1
  arousal: number;          // 0 to 1
  groundedness: number;     // 0 to 1
  dominantEmotions: string[];
  intensity: number;        // 0 to 1
  updatedAt?: string;
}

// ─── Safety ───────────────────────────────────────────────────────────────────

export interface SafetySignalDto {
  crisisDetected: boolean;
  tier: 0 | 1 | 2 | 3;
  confidence: number;
  signals: string[];
}

export interface SafetyAssessmentResult {
  tier: SafetyTierValue;
  requiresOverride: boolean;
  signals: string[];
  hardRailTriggered: boolean;
  protocolResponse?: string;
  resourcesToProvide?: string[];
}

export type SafetyTierValue = 0 | 1 | 2 | 3;

// ─── AI Pipeline ──────────────────────────────────────────────────────────────

export interface PipelineContext {
  userId: string;
  organizationId: string;
  threadId: string;
  messageId: string;
  userMessage: string;
  sessionHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  sessionTurnCount: number;
}

export interface PipelineResult {
  content: string;
  mode: AIMode;
  strategy: InterventionStrategy;
  safetyTier: SafetyTierValue;
  tokensUsed: number;
  latencyMs: number;
  modelUsed: string;
  explainability: PipelineExplainability;
}

export interface PipelineExplainability {
  emotionalState: EmotionalStateDto;
  safetyAssessment: SafetyAssessmentResult;
  selectedMode: AIMode;
  selectedStrategy: InterventionStrategy;
  modeRationale: string;
  strategyRationale: string;
  memoriesUsed: number;
  modelConfidence: number;
  interventionHistory: string[];
}

// ─── LMM ─────────────────────────────────────────────────────────────────────

export interface LmmSummary {
  userId: string;
  totalInteractions: number;
  confidenceScore: number;

  affective: {
    baselineValence: number;
    emotionalVolatility: number;
    emotionalGranularity: number;
  };

  cognitive: {
    locusOfControl: number;
    metacognitiveAwareness: number;
    cognitiveFlexibility: number;
    ruminationTendency: number;
  };

  relational: {
    attachmentStyle: string;
    socialBattery: number;
    boundaryStrength: number;
  };

  personality: {
    openness: number;
    conscientiousness: number;
    resilience: number;
    selfCompassion: number;
  };

  behavioral: {
    copingStyle: string;
    stressResponse: string;
    conflictStyle: string;
  };

  currentEmotionalState: EmotionalStateDto;
  activeRisks: ActiveRisk[];
  activeGoals: ActiveGoal[];
  activeTriggers: ActiveTrigger[];
  activeStressors: ActiveStressor[];

  keyMemories: KeyMemory[];
  strengths: string[];
  growthAreas: string[];
  preferredCopingMechanisms: string[];

  interventionEffectiveness: Record<string, EffectivenessEntry>;
}

export interface ActiveRisk {
  type: string;
  severity: number;
  detectedAt: string;
}

export interface ActiveGoal {
  id: string;
  description: string;
  domain: string;
  progress: number;
}

export interface ActiveTrigger {
  trigger: string;
  context: string;
  frequency: number;
  firstSeen: string;
}

export interface ActiveStressor {
  stressor: string;
  intensity: number;
  since: string;
}

export interface KeyMemory {
  id: string;
  type: string;
  content: string;
  confidence: number;
  domain?: string;
}

export interface EffectivenessEntry {
  totalUses: number;
  avgScore: number;
  lastUsed?: string;
  contexts?: string[];
}

// ─── AI Provider ──────────────────────────────────────────────────────────────

export interface ModelRequest {
  model: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  tools?: unknown[];
  toolChoice?: unknown;
}

export interface ModelResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  stopReason: string;
  latencyMs: number;
}

export interface EmbeddingRequest {
  input: string | string[];
  model: string;
  dimensions?: number;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  inputTokens: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
