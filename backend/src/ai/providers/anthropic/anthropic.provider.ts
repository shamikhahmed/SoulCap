import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { IAIProvider, IAnalysisProvider } from '../ai-provider.interface';
import { ModelRequest, ModelResponse } from '../../../common/types';

@Injectable()
export class AnthropicProvider implements IAIProvider, IAnalysisProvider {
  readonly providerName = 'anthropic';
  readonly supportedModels = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001', 'claude-opus-4-8'];

  private readonly client: Anthropic;
  private readonly logger = new Logger(AnthropicProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({ apiKey: this.config.getOrThrow('anthropic.apiKey') });
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    const start = Date.now();
    const messages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const systemMsg = request.systemPrompt
      ?? request.messages.find((m) => m.role === 'system')?.content;

    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens ?? 600,
      system: systemMsg,
      messages,
    });

    const content = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('');

    return {
      content,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
      stopReason: response.stop_reason ?? 'end_turn',
      latencyMs: Date.now() - start,
    };
  }

  async analyzeWithTool<T>(
    userMessage: string,
    toolName: string,
    toolSchema: Record<string, unknown>,
    systemPrompt?: string,
  ): Promise<T> {
    const analysisModel = this.config.get<string>('anthropic.analysisModel');

    const response = await this.client.messages.create({
      model: analysisModel ?? 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      tools: [{ name: toolName, description: 'Structured analysis tool', input_schema: toolSchema as Anthropic.Tool['input_schema'] }],
      tool_choice: { type: 'tool', name: toolName },
      messages: [{ role: 'user', content: userMessage }],
    });

    const toolUse = response.content.find((c) => c.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error(`Tool ${toolName} did not return a result`);
    }

    return toolUse.input as T;
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
