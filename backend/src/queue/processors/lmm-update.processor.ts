import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../bullmq/queue.constants';
import { UpdateLmmJobData, SnapshotLmmJobData } from '../bullmq/queue.contracts';
import { LivingMindService } from '../../modules/living-mind/living-mind.service';

@Processor(QUEUE_NAMES.LMM_UPDATE)
export class LmmUpdateProcessor extends WorkerHost {
  private readonly logger = new Logger(LmmUpdateProcessor.name);

  constructor(private readonly lmm: LivingMindService) {
    super();
  }

  async process(job: Job<UpdateLmmJobData | SnapshotLmmJobData>) {
    switch (job.name) {
      case 'lmm.update':
        return this.handleUpdate(job.data as UpdateLmmJobData);
      case 'lmm.snapshot':
        return this.handleSnapshot(job.data as SnapshotLmmJobData);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleUpdate(data: UpdateLmmJobData) {
    await this.lmm.updateFromInteraction(data.userId, data.organizationId, {
      emotionalState: data.emotionalState,
      strategyUsed: data.strategyUsed as string,
      strategyScore: data.implicitScore,
    });
    this.logger.debug(`LMM updated for user ${data.userId}`);
  }

  private async handleSnapshot(data: SnapshotLmmJobData) {
    await this.lmm.snapshotModel(data.userId, data.organizationId);
    this.logger.debug(`LMM snapshot created for user ${data.userId}`);
  }
}
