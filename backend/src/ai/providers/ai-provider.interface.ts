import { ModelRequest, ModelResponse, EmbeddingRequest, EmbeddingResponse } from '../../common/types';

export interface IAIProvider {
  readonly providerName: string;
  readonly supportedModels: string[];

  complete(request: ModelRequest): Promise<ModelResponse>;
  embed?(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  isAvailable(): Promise<boolean>;
}

export interface IAnalysisProvider extends IAIProvider {
  analyzeWithTool<T>(
    userMessage: string,
    toolName: string,
    toolSchema: Record<string, unknown>,
    systemPrompt?: string,
  ): Promise<T>;
}

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER';
export const ANALYSIS_PROVIDER_TOKEN = 'ANALYSIS_PROVIDER';
export const EMBEDDING_PROVIDER_TOKEN = 'EMBEDDING_PROVIDER';
