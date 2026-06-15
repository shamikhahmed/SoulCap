import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MessageRole, SafetyTier, AIMode, InterventionStrategy } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createThread(userId: string, organizationId: string, title?: string) {
    return this.prisma.conversationThread.create({
      data: { userId, organizationId, title: title ?? null },
    });
  }

  async findThreadById(id: string) {
    return this.prisma.conversationThread.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    });
  }

  async findUserThreads(userId: string, organizationId: string, limit = 20, cursor?: string) {
    return this.prisma.conversationThread.findMany({
      where: { userId, organizationId },
      orderBy: { lastMsgAt: 'desc' },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      select: { id: true, title: true, turnCount: true, lastMsgAt: true, startedAt: true, status: true },
    });
  }

  async createMessage(data: {
    threadId: string;
    userId: string;
    organizationId?: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    safetyTier?: SafetyTier;
    aiMode?: AIMode;
    aiStrategy?: InterventionStrategy;
    modelUsed?: string;
    tokensUsed?: number;
    latencyMs?: number;
    explainability?: object;
  }) {
    const message = await this.prisma.message.create({
      data: {
        threadId: data.threadId,
        userId: data.userId,
        role: data.role as MessageRole,
        content: data.content,
        safetyTier: data.safetyTier ?? SafetyTier.NONE,
        aiMode: data.aiMode,
        aiStrategy: data.aiStrategy,
        modelUsed: data.modelUsed,
        tokensUsed: data.tokensUsed,
        latencyMs: data.latencyMs,
        explainability: data.explainability as object,
      },
    });
    await this.prisma.conversationThread.update({
      where: { id: data.threadId },
      data: { turnCount: { increment: 1 }, lastMsgAt: new Date() },
    });
    return message;
  }

  async getRecentMessages(threadId: string, limit = 20) {
    return this.prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async closeThread(threadId: string) {
    return this.prisma.conversationThread.update({
      where: { id: threadId },
      data: { endedAt: new Date() },
    });
  }

  async archiveThread(threadId: string) {
    return this.prisma.conversationThread.update({
      where: { id: threadId },
      data: { status: 'ARCHIVED', endedAt: new Date() },
    });
  }

  async getMessagesPaginated(threadId: string, limit = 50, before?: string) {
    return this.prisma.message.findMany({
      where: { threadId, ...(before ? { createdAt: { lt: new Date(before) } } : {}) },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }
}
