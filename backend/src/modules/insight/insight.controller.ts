import { Controller, Get, Patch, Param, Body, Query, Req } from '@nestjs/common';
import { InsightService } from './insight.service';
import { Request } from 'express';

@Controller('insights')
export class InsightController {
  constructor(private readonly insights: InsightService) {}

  @Get()
  async list(@Req() req: Request, @Query('unread') unread?: string) {
    const { id: userId, organizationId } = (req as any).user;
    return this.insights.list(userId, organizationId, unread === 'true');
  }

  @Patch(':id/seen')
  async markSeen(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.insights.markSeen(id, userId);
  }

  @Patch(':id/react')
  async react(@Req() req: Request, @Param('id') id: string, @Body('reaction') reaction: string) {
    const { id: userId } = (req as any).user;
    return this.insights.react(id, userId, reaction);
  }
}
