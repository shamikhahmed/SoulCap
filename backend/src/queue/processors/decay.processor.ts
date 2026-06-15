import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../bullmq/queue.constants';
import { LivingMindService } from '../../modules/living-mind/living-mind.service';

@Processor(QUEUE_NAMES.DECAY_PROCESSING)
export class DecayProcessor extends WorkerHost {
  private readonly logger = new Logger(DecayProcessor.name);

  constructor(private readonly lmm: LivingMindService) {
    super();
  }

  async process(job: Job<{ userId: string; organizationId: string }>) {
    await this.lmm.runDecay(job.data.userId, job.data.organizationId);
    this.logger.debug(`Decay run for user ${job.data.userId}`);
  }
}
