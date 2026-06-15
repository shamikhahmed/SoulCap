import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LivingMindService } from '../../modules/living-mind/living-mind.service';

@Injectable()
export class DecayCronService {
  private readonly logger = new Logger(DecayCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly lmm: LivingMindService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runDailyDecay() {
    this.logger.log('Running daily LMM confidence decay');

    const models = await this.prisma.livingMindModel.findMany({
      where: { confidenceScore: { gt: 0.1 } },
      select: { id: true, userId: true, organizationId: true },
    });

    let processed = 0;
    for (const model of models) {
      try {
        await this.lmm.runDecay(model.userId, model.organizationId);
        processed++;
      } catch (err) {
        this.logger.error(`Decay failed for model ${model.id}`, err);
      }
    }

    this.logger.log(`Decay complete: ${processed}/${models.length} models processed`);
  }
}
