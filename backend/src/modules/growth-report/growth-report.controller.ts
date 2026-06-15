import { Controller, Get, Post, Param, Query, Req } from '@nestjs/common';
import { GrowthReportService } from './growth-report.service';
import { Request } from 'express';

@Controller('growth-reports')
export class GrowthReportController {
  constructor(private readonly reports: GrowthReportService) {}

  @Get()
  async list(@Req() req: Request) {
    const { id: userId, organizationId } = (req as any).user;
    return this.reports.list(userId, organizationId);
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.reports.getById(id, userId);
  }

  @Post('generate/monthly')
  async generateMonthly(
    @Req() req: Request,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const { id: userId, organizationId } = (req as any).user;
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    return this.reports.generateMonthly(userId, organizationId, y, m);
  }
}
