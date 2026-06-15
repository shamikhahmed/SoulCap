import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnthropicProvider } from '../providers/anthropic/anthropic.provider';
import { OpenAIProvider } from '../providers/openai/openai.provider';
import { RouteRequest, RouteDecision, MODEL_REGISTRY } from './model-router.types';
import { ModelRequest, ModelResponse, EmbeddingRequest, EmbeddingResponse } from '../../common/types';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class ModelRouterService {
  private readonly logger = new Logger(ModelRouterService.name);

  constructor(
    private readonly anthropic: AnthropicProvider,
    private readonly openai: OpenAIProvider,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  route(request: RouteRequest): RouteDecision {
    if (request.role === 'embedding') {
      return {
        provider: 'openai',
        modelId: MODEL_REGISTRY.openai.embedding,
        rationale: 'OpenAI embeddings for pgvector',
      };
    }

    const prefer = request.preferProvider ?? 'anthropic';

    if (prefer === 'anthropic') {
      return {
        provider: 'anthropic',
        modelId: request.role === 'analysis'
          ? MODEL_REGISTRY.anthropic.analysis
          : MODEL_REGISTRY.anthropic.generation,
        fallbackProvider: 'openai',
        fallbackModelId: request.role === 'analysis'
          ? MODEL_REGISTRY.openai.analysis
          : MODEL_REGISTRY.openai.generation,
        rationale: `Anthropic ${request.role} — OpenAI fallback`,
      };
    }

    return {
      provider: 'openai',
      modelId: request.role === 'analysis'
        ? MODEL_REGISTRY.openai.analysis
        : MODEL_REGISTRY.openai.generation,
      fallbackProvider: 'anthropic',
      fallbackModelId: MODEL_REGISTRY.anthropic.generation,
      rationale: `OpenAI ${request.role} — Anthropic fallback`,
    };
  }

  async complete(modelRequest: ModelRequest, routeReq: RouteRequest): Promise<ModelResponse> {
    const decision = this.route(routeReq);
    const start = Date.now();

    try {
      const provider = decision.provider === 'anthropic' ? this.anthropic : this.openai;
      const response = await provider.complete({ ...modelRequest, model: decision.modelId });
      await this.logUsage(decision.provider, decision.modelId, routeReq, response, true);
      return response;
    } catch (primaryErr) {
      this.logger.warn(`Primary provider ${decision.provider} failed: ${(primaryErr as Error).message}. Trying fallback.`);

      if (!decision.fallbackProvider || !decision.fallbackModelId) throw primaryErr;

      const fallback = decision.fallbackProvider === 'anthropic' ? this.anthropic : this.openai;
      const response = await fallback.complete({ ...modelRequest, model: decision.fallbackModelId });
      await this.logUsage(decision.fallbackProvider, decision.fallbackModelId, routeReq, response, true);
      return response;
    }
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.openai.embed({
      ...request,
      model: request.model ?? MODEL_REGISTRY.openai.embedding,
    });
  }

  async analyzeWithTool<T>(
    userMessage: string,
    toolName: string,
    toolSchema: Record<string, unknown>,
    systemPrompt?: string,
  ): Promise<T> {
    try {
      return await this.anthropic.analyzeWithTool<T>(userMessage, toolName, toolSchema, systemPrompt);
    } catch (err) {
      this.logger.warn(`Anthropic analysis failed, no fallback for tool_use: ${(err as Error).message}`);
      throw err;
    }
  }

  private async logUsage(
    provider: string,
    model: string,
    routeReq: RouteRequest,
    response: ModelResponse,
    success: boolean,
  ) {
    try {
      const dbProvider = await this.prisma.aIProvider.findFirst({
        where: { type: provider.toUpperCase() as 'ANTHROPIC' | 'OPENAI', modelId: model },
      });

      await this.prisma.aIUsageLog.create({
        data: {
          userId: routeReq.userId,
          organizationId: routeReq.organizationId,
          providerId: dbProvider?.id ?? '00000000-0000-0000-0000-000000000000',
          operation: routeReq.role,
          model,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          totalTokens: response.inputTokens + response.outputTokens,
          costUsd: 0, // TODO: per-model cost calculation
          latencyMs: response.latencyMs,
          success,
        },
      });
    } catch { /* non-critical */ }
  }
}
