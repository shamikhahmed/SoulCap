import { PipelineContext, PipelineResult } from '../../common/types';

export interface IPipelineStep<TInput = PipelineState, TOutput = PipelineState> {
  readonly stepName: string;
  execute(state: TInput, context: PipelineContext): Promise<TOutput>;
}

export interface PipelineState {
  context: PipelineContext;

  // Step 1 output: Emotion Analysis
  emotionalState?: {
    valence: number;
    arousal: number;
    groundedness: number;
    dominantEmotions: string[];
    intensity: number;
    updatedAt: string;
  };
  safetySignals?: {
    crisisDetected: boolean;
    tier: 0 | 1 | 2 | 3;
    confidence: number;
    signals: string[];
  };
  mentionedRelationships?: string[];
  topics?: string[];
  keywords?: string[];

  // Quick scan (sync, before Step 1)
  quickScanTier?: 0 | 1 | 2 | 3;

  // Step 2 output: Safety Assessment
  safetyAssessment?: import('../../common/types').SafetyAssessmentResult;

  // Step 3 output: LMM Context
  lmmSummary?: import('../../common/types').LmmSummary;

  // Step 4 output: Memory Retrieval
  retrievedMemories?: Array<{
    id: string;
    content: string;
    type: string;
    relevance: number;
    emotionalValence: number;
    topics: string[];
    daysAgo: number;
  }>;

  // Step 5 output: Pattern Detection
  activePatterns?: Array<{
    patternId: string;
    name: string;
    type: string;
    confidence: number;
  }>;

  // Step 6 output: Strategy Selection
  selectedMode?: import('../../common/types').AIMode;
  selectedStrategy?: import('../../common/types').InterventionStrategy;
  modeRationale?: string;
  strategyRationale?: string;

  // Step 7 output: Prompt Assembly
  systemPrompt?: string;

  // Step 8 output: Model Routing
  modelId?: string;
  provider?: string;

  // Step 9 output: Response Generation
  rawResponse?: string;
  tokensUsed?: number;
  latencyMs?: number;

  // Step 10 output: Post-processing
  finalResponse?: string;
  explainability?: import('../../common/types').PipelineExplainability;

  // Errors (non-fatal — pipeline continues with fallbacks)
  stepErrors?: Record<string, string>;
}
