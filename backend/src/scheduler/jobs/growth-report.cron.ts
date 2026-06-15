import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma/prisma.service';
import { GrowthReportService } from '../../modules/growth-report/growth-report.service';

@Injectable()
export class GrowthReportCronService {
  private readonly logger = new Logger(GrowthReportCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly growthReport: GrowthReportService,
  ) {}

  // 1st of every month at 4am
  @Cron('0 4 1 * *')
  async generateMonthlyReports() {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = prevMonth.getFullYear();
    const month = prevMonth.getMonth() + 1;

    this.logger.log(`Generating monthly growth reports for ${year}-${String(month).padStart(2, '0')}`);

    // Find users who had activity in the previous month
    const activeUsers = await this.prisma.checkIn.findMany({
      where: {
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0),
        },
      },
      distinct: ['userId'],
      select: { userId: true, organizationId: true },
    });

    let generated = 0;
    for (const { userId, organizationId } of activeUsers) {
      try {
        await this.growthReport.generateMonthly(userId, organizationId, year, month);
        generated++;
      } catch (err) {
        this.logger.error(`Report failed for user ${userId}`, err);
      }
    }

    this.logger.log(`Monthly reports complete: ${generated}/${activeUsers.length}`);
  }
}
