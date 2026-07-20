// ─── Emotional State ─────────────────────────────────────────────────────────

export interface EmotionalState {
  valence: number;        // -1 to 1 (negative → positive)
  arousal: number;        // 0 to 1 (calm → activated)
  groundedness: number;   // 0 to 1 (dissociated → present)
  dominantEmotions: string[];
  intensity: number;      // 0 to 1
  updatedAt: string;      // ISO timestamp
}

// ─── Belief Nodes ─────────────────────────────────────────────────────────────

export enum BeliefDomain {
  AFFECTIVE = 'AFFECTIVE',
  COGNITIVE = 'COGNITIVE',
  BEHAVIORAL = 'BEHAVIORAL',
  RELATIONAL = 'RELATIONAL',
  MOTIVATIONAL = 'MOTIVATIONAL',
  NARRATIVE = 'NARRATIVE',
  SOMATIC = 'SOMATIC',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
}

export enum ProvenanceType {
  EXPLICIT = 'EXPLICIT',
  INFERRED = 'INFERRED',
  CORROBORATED = 'CORROBORATED',
  HYPOTHESIZED = 'HYPOTHESIZED',
}

export interface BeliefRevision {
  timestamp: string;
  priorConfidence: number;
  newConfidence: number;
  trigger: 'NewEvidence' | 'UserCorrection' | 'Contradiction' | 'DecayReview' | 'ModelCalibration';
  evidence: string;
}

// ─── LMM Summary (injected into AI prompt) ───────────────────────────────────

export interface LmmSummary {
  userId: string;
  totalInteractions: number;
  confidenceScore: number;

  // Affective profile
  affective: {
    baselineHedonic: number;
    emotionalVolatility: number;
    emotionalGranularity: number;
  };

  // Cognitive profile
  cognitive: {
    locusOfControl: number;
    metacognitiveAwareness: number;
  };

  // Relational profile
  relational: {
    attachmentStyle: string;
  };

  // Current state
  currentEmotionalState: EmotionalState;

  // Active context
  activeRisks: ActiveRisk[];
  activeGoals: ActiveGoal[];
  activeTriggers: ActiveTrigger[];

  // Top belief nodes (high confidence, display-eligible)
  keyBeliefs: KeyBelief[];

  // Intervention history summary
  interventionEffectiveness: Record<string, { avgScore: number; totalUses: number }>;
}

export interface ActiveRisk {
  type: string;
  severity: 'low' | 'medium' | 'high';
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
}

export interface KeyBelief {
  domain: BeliefDomain;
  subdomain: string;
  claim: string;
  confidence: number;
  provenanceType: ProvenanceType;
}

// ─── AI Mode ──────────────────────────────────────────────────────────────────

export enum AIMode {
  SUPPORT = 'SUPPORT',
  COACHING = 'COACHING',
  REFLECTION = 'REFLECTION',
  CRISIS = 'CRISIS',
}

// ─── Response Strategy ────────────────────────────────────────────────────────

export enum ResponseStrategy {
  WITNESS = 'witness',       // pure empathic presence
  REFLECT = 'reflect',       // mirror emotional content back
  EXPLORE = 'explore',       // open new territory with a question
  PATTERN = 'pattern',       // surface a recognized pattern
  REFRAME = 'reframe',       // alternative perspective on meaning
  EDUCATE = 'educate',       // introduce a psychological concept
  ACTIVATE = 'activate',     // guide toward concrete behavioral step
  GROUND = 'ground',         // somatic/grounding for acute distress
  CHALLENGE = 'challenge',   // gentle confrontation of avoidance
  RESOURCE = 'resource',     // bridge to professional support
}

// ─── Safety ───────────────────────────────────────────────────────────────────

export interface SafetySignals {
  crisisDetected: boolean;
  confidence: number;
  tier: 0 | 1 | 2 | 3;  // 0=none, 1=distress, 2=elevated, 3=acute
  signals: string[];
}

// ─── Orchestration Output ────────────────────────────────────────────────────

export interface OrchestrationResult {
  content: string;
  mode: AIMode;
  strategy: ResponseStrategy;
  safetyTier: number;
  explainability: {
    detectedEmotions: EmotionalState;
    selectedMode: AIMode;
    selectedStrategy: ResponseStrategy;
    modeRationale: string;
    strategyRationale: string;
    memoriesUsed: number;
    modelConfidence: number;
  };
}
