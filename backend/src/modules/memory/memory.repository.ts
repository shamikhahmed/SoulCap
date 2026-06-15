import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MemoryType, MemorySource } from '@prisma/client';

const EPISODIC_CAP = 50;

@Injectable()
export class MemoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRecentMemories(userId: string, organizationId: string, limit = 10) {
    return this.prisma.memoryItem.findMany({
      where: { userId, organizationId, deletedAt: null, userRejected: false },
      orderBy: [{ relevance: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });
  }

  async createMemory(data: {
    userId: string;
    organizationId: string;
    type: MemoryType;
    content: string;
    domain?: string;
    subdomain?: string;
    confidence?: number;
    relevance?: number;
    tags?: string[];
    threadId?: string;
  }) {
    // Dedup: same user/domain/subdomain/content
    const existing = await this.prisma.memoryItem.findFirst({
      where: {
        userId: data.userId,
        organizationId: data.organizationId,
        type: data.type,
        domain: data.domain,
        subdomain: data.subdomain,
        content: data.content,
        deletedAt: null,
      },
    });

    if (existing) {
      return this.prisma.memoryItem.update({
        where: { id: existing.id },
        data: { confidence: Math.min(1, existing.confidence + 0.05), updatedAt: new Date() },
      });
    }

    await this.enforceEpisodicCap(data.userId, data.organizationId);

    return this.prisma.memoryItem.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId,
        type: data.type,
        source: MemorySource.INFERRED,
        content: data.content,
        domain: data.domain,
        subdomain: data.subdomain,
        confidence: data.confidence ?? 0.5,
        relevance: data.relevance ?? 0.5,
        tags: data.tags ?? [],
        ...(data.threadId && { relatedEntityId: data.threadId, relatedEntityType: 'thread' }),
      },
    });
  }

  private async enforceEpisodicCap(userId: string, organizationId: string) {
    const count = await this.prisma.memoryItem.count({
      where: { userId, organizationId, deletedAt: null },
    });

    if (count >= EPISODIC_CAP) {
      const oldest = await this.prisma.memoryItem.findFirst({
        where: { userId, organizationId, deletedAt: null, userValidated: false },
        orderBy: [{ relevance: 'asc' }, { updatedAt: 'asc' }],
      });
      if (oldest) {
        await this.prisma.memoryItem.update({ where: { id: oldest.id }, data: { deletedAt: new Date() } });
      }
    }
  }

  async userValidate(memoryId: string, accepted: boolean) {
    return this.prisma.memoryItem.update({
      where: { id: memoryId },
      data: {
        userValidated: accepted,
        userRejected: !accepted,
        lastValidatedAt: new Date(),
        ...(accepted && { confidence: { increment: 0.1 }, relevance: { increment: 0.1 } }),
      },
    });
  }

  async findByIds(ids: string[]) {
    return this.prisma.memoryItem.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
  }
}
