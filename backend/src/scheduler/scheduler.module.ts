import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DecayCronService } from './jobs/decay.cron';
import { SnapshotCronService } from './jobs/snapshot.cron';
import { GrowthReportCronService } from './jobs/growth-report.cron';
import { LivingMindModule } from '../modules/living-mind/living-mind.module';
import { GrowthReportModule } from '../modules/growth-report/growth-report.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LivingMindModule,
    GrowthReportModule,
  ],
  providers: [DecayCronService, SnapshotCronService, GrowthReportCronService],
})
export class SchedulerModule {}
