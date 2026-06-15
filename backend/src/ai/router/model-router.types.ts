export type ModelRole = 'generation' | 'analysis' | 'embedding' | 'classification';

export interface RouteRequest {
  role: ModelRole;
  userId?: string;
  organizationId?: string;
  preferProvider?: 'anthropic' | 'openai';
  requiresLongContext?: boolean;
  maxLatencyMs?: number;
  costSensitive?: boolean;
}

export interface RouteDecision {
  provider: 'anthropic' | 'openai';
  modelId: string;
  fallbackProvider?: 'anthropic' | 'openai';
  fallbackModelId?: string;
  rationale: string;
}

export const MODEL_REGISTRY = {
  anthropic: {
    generation: 'claude-sonnet-4-6',
    analysis:   'claude-haiku-4-5-20251001',
    longContext: 'claude-opus-4-8',
  },
  openai: {
    generation: 'gpt-4o',
    analysis:   'gpt-4o-mini',
    embedding:  'text-embedding-3-small',
    embeddingLarge: 'text-embedding-3-large',
  },
} as const;
