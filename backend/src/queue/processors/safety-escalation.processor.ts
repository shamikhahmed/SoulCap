import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../bullmq/queue.constants';
import { EscalateSafetyJobData } from '../bullmq/queue.contracts';
import { PrismaService } from '../../database/prisma/prisma.service';
import { SafetyTier } from '@prisma/client';

@Processor(QUEUE_NAMES.SAFETY_ESCALATION)
export class SafetyEscalationProcessor extends WorkerHost {
  private readonly logger = new Logger(SafetyEscalationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<EscalateSafetyJobData>) {
    const { userId, organizationId, tier, signals } = job.data;
    this.logger.warn(`Safety escalation: user=${userId}, tier=${tier}, signals=${signals.join(',')}`);

    await this.prisma.safetyFlag.create({
      data: {
        userId,
        organizationId,
        tier: tier as SafetyTier,
        signals,
        sourceType: 'AI_PIPELINE',
        rawSignalHash: '',
      },
    });
  }
}
