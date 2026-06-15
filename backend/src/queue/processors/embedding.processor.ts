import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../bullmq/queue.constants';
import { GenerateEmbeddingJobData } from '../bullmq/queue.contracts';
import { EmbeddingService } from '../../ai/embeddings/embedding.service';

@Processor(QUEUE_NAMES.EMBEDDING_GENERATION)
export class EmbeddingProcessor extends WorkerHost {
  private readonly logger = new Logger(EmbeddingProcessor.name);

  constructor(private readonly embeddings: EmbeddingService) {
    super();
  }

  async process(job: Job<GenerateEmbeddingJobData>) {
    const { entityId, content, entityType, userId } = job.data;
    if (entityType === 'message') {
      await this.embeddings.indexMessage(entityId, userId, content);
    } else {
      await this.embeddings.indexMemory(entityId, content);
    }
    this.logger.debug(`Embedding generated for ${entityType} ${entityId}`);
  }
}
