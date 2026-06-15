import { Module } from '@nestjs/common';
import { GrowthReportService } from './growth-report.service';
import { GrowthReportController } from './growth-report.controller';

@Module({
  providers: [GrowthReportService],
  controllers: [GrowthReportController],
  exports: [GrowthReportService],
})
export class GrowthReportModule {}
