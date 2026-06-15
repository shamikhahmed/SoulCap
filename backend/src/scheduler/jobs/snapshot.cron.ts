import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LivingMindService } from '../../modules/living-mind/living-mind.service';

@Injectable()
export class SnapshotCronService {
  private readonly logger = new Logger(SnapshotCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly lmm: LivingMindService,
  ) {}

  // Every Sunday at 2am
  @Cron('0 2 * * 0')
  async runWeeklySnapshots() {
    this.logger.log('Running weekly LMM snapshots');

    const models = await this.prisma.livingMindModel.findMany({
      where: { confidenceScore: { gt: 0.3 } },
      select: { id: true, userId: true, organizationId: true, updatedAt: true },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const active = models.filter((m) => m.updatedAt >= oneWeekAgo);

    let snapped = 0;
    for (const model of active) {
      try {
        await this.lmm.snapshotModel(model.userId, model.organizationId);
        snapped++;
      } catch (err) {
        this.logger.error(`Snapshot failed for model ${model.id}`, err);
      }
    }

    this.logger.log(`Snapshots complete: ${snapped}/${active.length} active models snapshotted`);
  }
}
