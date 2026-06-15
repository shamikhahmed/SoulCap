import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelRouterService } from '../router/model-router.service';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly model: string;
  private readonly dimensions: number;

  constructor(
    private readonly router: ModelRouterService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.model = this.config.get('openai.embeddingModel', 'text-embedding-3-small');
    this.dimensions = this.config.get('openai.embeddingDimension', 1536);
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.router.embed({ input: text, model: this.model, dimensions: this.dimensions });
    return response.embeddings[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await this.router.embed({ input: texts, model: this.model, dimensions: this.dimensions });
    return response.embeddings;
  }

  async indexMessage(messageId: string, userId: string, content: string): Promise<void> {
    try {
      const embedding = await this.embedText(content);
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO message_embeddings (id, message_id, user_id, embedding, model, dimension)
         VALUES (gen_random_uuid(), $1, $2, $3::vector, $4, $5)
         ON CONFLICT (message_id) DO UPDATE SET embedding = $3::vector`,
        messageId,
        userId,
        `[${embedding.join(',')}]`,
        this.model,
        this.dimensions,
      );
    } catch (err) {
      this.logger.error(`Failed to index message ${messageId}`, err);
    }
  }

  async indexMemory(memoryItemId: string, content: string): Promise<void> {
    try {
      const embedding = await this.embedText(content);
      await this.prisma.$executeRawUnsafe(
        `UPDATE memory_items SET embedding = $1::vector WHERE id = $2`,
        `[${embedding.join(',')}]`,
        memoryItemId,
      );
    } catch (err) {
      this.logger.error(`Failed to index memory ${memoryItemId}`, err);
    }
  }

  async semanticSearch(
    query: string,
    userId: string,
    table: 'message_embeddings' | 'memory_items',
    limit = 5,
    threshold = 0.7,
  ): Promise<Array<{ id: string; similarity: number }>> {
    const queryEmbedding = await this.embedText(query);
    const vectorStr = `[${queryEmbedding.join(',')}]`;

    const idColumn = table === 'message_embeddings' ? 'message_id' : 'id';

    const results = await this.prisma.$queryRawUnsafe<Array<{ id: string; similarity: number }>>(
      `SELECT ${idColumn} as id,
              1 - (embedding <=> $1::vector) as similarity
       FROM ${table}
       WHERE user_id = $2
         AND embedding IS NOT NULL
         AND 1 - (embedding <=> $1::vector) > $3
       ORDER BY embedding <=> $1::vector
       LIMIT $4`,
      vectorStr,
      userId,
      threshold,
      limit,
    );

    return results;
  }
}
