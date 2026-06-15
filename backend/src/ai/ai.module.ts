import { Global, Module } from '@nestjs/common';
import { AnthropicProvider } from './providers/anthropic/anthropic.provider';
import { OpenAIProvider } from './providers/openai/openai.provider';
import { ModelRouterService } from './router/model-router.service';
import { EmbeddingService } from './embeddings/embedding.service';
import { SafetyGateService } from './safety/safety-gate.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';
import { AIPipelineService } from './pipeline/pipeline.service';

@Global()
@Module({
  providers: [
    AnthropicProvider,
    OpenAIProvider,
    ModelRouterService,
    EmbeddingService,
    SafetyGateService,
    PromptBuilderService,
    AIPipelineService,
  ],
  exports: [
    ModelRouterService,
    EmbeddingService,
    SafetyGateService,
    PromptBuilderService,
    AIPipelineService,
  ],
})
export class AiModule {}
