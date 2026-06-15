import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { CheckInService } from './check-in.service';
import { SubmitCheckInDto } from './dto/check-in.dto';

@Controller({ path: 'check-ins', version: '1' })
export class CheckInController {
  constructor(private readonly checkIns: CheckInService) {}

  @Post()
  submit(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string, @Body() dto: SubmitCheckInDto) {
    return this.checkIns.submit(user.id, orgId, dto);
  }

  @Get()
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Query('limit') limit?: number,
  ) {
    return this.checkIns.getHistory(user.id, orgId, limit ?? 30);
  }

  @Get('today')
  getToday(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.checkIns.getTodayCheckIn(user.id, orgId);
  }
}
