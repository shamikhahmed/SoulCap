import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationRepository } from './conversation.repository';
import { LivingMindService } from '../living-mind/living-mind.service';
import { MemoryService } from '../memory/memory.service';
import { AIPipelineService } from '../../ai/pipeline/pipeline.service';
import { EmbeddingService } from '../../ai/embeddings/embedding.service';
import { MessageReceivedEvent, MessageSentEvent } from '../../events/contracts/domain.events';
import { AuthenticatedUser } from '../../common/types';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ConversationService {
  constructor(
    private readonly repo: ConversationRepository,
    private readonly lmm: LivingMindService,
    private readonly memory: MemoryService,
    private readonly pipeline: AIPipelineService,
    private readonly embeddings: EmbeddingService,
    private readonly events: EventEmitter2,
  ) {}

  async startThread(user: AuthenticatedUser, title?: string) {
    return this.repo.createThread(user.id, user.organizationId, title);
  }

  async listThreads(user: AuthenticatedUser, limit = 20, cursor?: string) {
    return this.repo.findUserThreads(user.id, user.organizationId, limit, cursor);
  }

  async getThread(threadId: string) {
    const thread = await this.repo.findThreadById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async sendMessage(user: AuthenticatedUser, dto: SendMessageDto) {
    const threadId = dto.threadId ?? (await this.repo.createThread(user.id, user.organizationId)).id;

    const recentMessages = await this.repo.getRecentMessages(threadId, 20);
    const sessionHistory = recentMessages.map((m) => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    })) as { role: 'user' | 'assistant'; content: string }[];

    await this.repo.createMessage({
      threadId,
      userId: user.id,
      role: 'USER',
      content: dto.message,
    });

    this.events.emit('message.received', new MessageReceivedEvent(user.id, user.organizationId, threadId, '', dto.message));

    void this.embeddings.indexMessage(threadId + '_user_' + Date.now(), user.id, dto.message);

    const [lmmSummary, memories] = await Promise.all([
      this.lmm.getSummary(user.id, user.organizationId),
      this.memory.retrieveForContext(user.id, user.organizationId, dto.message, 6),
    ]);

    const result = await this.pipeline.run(
      {
        userId: user.id,
        organizationId: user.organizationId,
        threadId,
        messageId: '',
        userMessage: dto.message,
        sessionHistory,
        sessionTurnCount: recentMessages.length,
      },
      lmmSummary,
      memories,
    );

    const tierMap = ['NONE', 'DISTRESS', 'ELEVATED', 'ACUTE'] as const;
    const aiMessage = await this.repo.createMessage({
      threadId,
      userId: user.id,
      role: 'ASSISTANT',
      content: result.content,
      safetyTier: tierMap[result.safetyTier] as import('@prisma/client').SafetyTier,
      aiMode: result.mode as import('@prisma/client').AIMode,
      aiStrategy: result.strategy as import('@prisma/client').InterventionStrategy,
      modelUsed: result.modelUsed,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs,
      explainability: result.explainability as object,
    });

    void this.embeddings.indexMessage(aiMessage.id, user.id, result.content);

    this.events.emit('message.sent', new MessageSentEvent(
      user.id,
      user.organizationId,
      threadId,
      aiMessage.id,
      result.mode,
      result.strategy,
      result.safetyTier as import('@prisma/client').SafetyTier,
    ));

    void this.lmm.updateFromInteraction(user.id, user.organizationId, {
      emotionalState: result.explainability.emotionalState,
      strategyUsed: result.strategy,
    });

    return {
      threadId,
      messageId: aiMessage.id,
      content: result.content,
      mode: result.mode,
      strategy: result.strategy,
      safetyTier: result.safetyTier,
    };
  }

  async getMessages(threadId: string, limit = 50, before?: string) {
    return this.repo.getRecentMessages(threadId, limit);
  }

  async closeThread(threadId: string) {
    return this.repo.closeThread(threadId);
  }

  async archiveThread(threadId: string) {
    return this.repo.archiveThread(threadId);
  }
}
