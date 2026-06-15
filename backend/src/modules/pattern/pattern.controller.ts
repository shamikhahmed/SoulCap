import { Controller, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternStatus } from '@prisma/client';
import { Request } from 'express';

@Controller('patterns')
export class PatternController {
  constructor(private readonly patterns: PatternService) {}

  @Get()
  async list(@Req() req: Request, @Query('status') status?: PatternStatus) {
    const { id: userId, organizationId } = (req as any).user;
    return this.patterns.list(userId, organizationId, status);
  }

  @Patch(':id/acknowledge')
  async acknowledge(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.patterns.acknowledge(id, userId);
  }

  @Patch(':id/resolve')
  async resolve(@Req() req: Request, @Param('id') id: string) {
    const { id: userId } = (req as any).user;
    return this.patterns.resolve(id, userId);
  }
}
