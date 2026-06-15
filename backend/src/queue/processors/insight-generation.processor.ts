import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InsightService } from '../../modules/insight/insight.service';

export interface InsightGenerationJobData {
  userId: string;
  organizationId: string;
  contextSummary: string;
  evidenceIds: string[];
}

@Processor('insight-generation')
export class InsightGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(InsightGenerationProcessor.name);

  constructor(private readonly insights: InsightService) {
    super();
  }

  async process(job: Job<InsightGenerationJobData>) {
    const { userId, organizationId, contextSummary, evidenceIds } = job.data;
    this.logger.debug(`Generating insights for user ${userId}`);

    await this.insights.generateFromContext(userId, organizationId, contextSummary, evidenceIds);
  }
}
