import { Injectable } from '@nestjs/common';
import { MemoryRepository } from './memory.repository';
import { EmbeddingService } from '../../ai/embeddings/embedding.service';
import { MemoryType } from '@prisma/client';

@Injectable()
export class MemoryService {
  constructor(
    private readonly repo: MemoryRepository,
    private readonly embeddings: EmbeddingService,
  ) {}

  async retrieveForContext(
    userId: string,
    organizationId: string,
    query: string,
    limit = 6,
  ) {
    const [semanticIds, recentMemories] = await Promise.all([
      this.embeddings.semanticSearch(query, userId, 'memory_items', limit, 0.65),
      this.repo.findRecentMemories(userId, organizationId, 10),
    ]);

    const recentIds = new Set(recentMemories.map((m) => m.id));
    const semanticOnlyIds = semanticIds.filter((r) => !recentIds.has(r.id)).map((r) => r.id);
    const semanticMemories = semanticOnlyIds.length > 0 ? await this.repo.findByIds(semanticOnlyIds) : [];

    const all = [...recentMemories, ...semanticMemories];
    const scoreMap = new Map(semanticIds.map((r) => [r.id, r.similarity]));

    return all
      .map((m) => ({
        id: m.id,
        content: m.content,
        type: m.type,
        relevance: Math.max(m.relevance, scoreMap.get(m.id) ?? 0),
        emotionalValence: 0,
        topics: (m.tags as string[]) ?? [],
        daysAgo: Math.floor((Date.now() - m.updatedAt.getTime()) / 86_400_000),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }

  async storeMemory(data: {
    userId: string;
    organizationId: string;
    type: MemoryType;
    content: string;
    domain?: string;
    subdomain?: string;
    confidence?: number;
    relevance?: number;
    topics?: string[];
    threadId?: string;
  }) {
    const item = await this.repo.createMemory({
      ...data,
      tags: data.topics,
    });
    void this.embeddings.indexMemory(item.id, data.content);
    return item;
  }

  async userValidate(memoryId: string, accepted: boolean) {
    return this.repo.userValidate(memoryId, accepted);
  }
}
