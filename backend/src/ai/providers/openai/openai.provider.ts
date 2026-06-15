import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IAIProvider } from '../ai-provider.interface';
import { ModelRequest, ModelResponse, EmbeddingRequest, EmbeddingResponse } from '../../../common/types';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  readonly providerName = 'openai';
  readonly supportedModels = ['gpt-4o', 'gpt-4o-mini', 'text-embedding-3-small', 'text-embedding-3-large'];

  private readonly client: OpenAI;
  private readonly logger = new Logger(OpenAIProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({ apiKey: this.config.getOrThrow('openai.apiKey') });
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    const start = Date.now();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = request.systemPrompt
      ? [{ role: 'system', content: request.systemPrompt }, ...request.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))]
      : request.messages.map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }));

    const response = await this.client.chat.completions.create({
      model: request.model,
      messages,
      max_tokens: request.maxTokens ?? 600,
      temperature: request.temperature ?? 0.7,
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content ?? '',
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      model: response.model,
      stopReason: choice.finish_reason ?? 'stop',
      latencyMs: Date.now() - start,
    };
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const inputs = Array.isArray(request.input) ? request.input : [request.input];

    const response = await this.client.embeddings.create({
      model: request.model,
      input: inputs,
      dimensions: request.dimensions,
    });

    return {
      embeddings: response.data.map((d) => d.embedding),
      model: response.model,
      inputTokens: response.usage.prompt_tokens,
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }
}
