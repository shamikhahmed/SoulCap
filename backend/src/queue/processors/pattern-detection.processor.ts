import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PatternService } from '../../modules/pattern/pattern.service';

export interface PatternDetectionJobData {
  userId: string;
  organizationId: string;
  evidenceIds: string[];
  evidenceTexts: string[];
}

@Processor('pattern-detection')
export class PatternDetectionProcessor extends WorkerHost {
  private readonly logger = new Logger(PatternDetectionProcessor.name);

  constructor(private readonly patterns: PatternService) {
    super();
  }

  async process(job: Job<PatternDetectionJobData>) {
    const { userId, organizationId, evidenceIds, evidenceTexts } = job.data;
    this.logger.debug(`Detecting patterns for user ${userId}, ${evidenceIds.length} evidence items`);

    await this.patterns.detectFromEvidence(userId, organizationId, evidenceIds, evidenceTexts);
  }
}
