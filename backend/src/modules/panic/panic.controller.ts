import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { PanicService } from './panic.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'panic', version: '1' })
export class PanicController {
  constructor(private readonly svc: PanicService) {}

  @Get('flows')
  getFlows() {
    return this.svc.getAvailableFlows();
  }

  @Get('flows/:key')
  getFlow(@Param('key') key: string) {
    return this.svc.getFlow(key as any);
  }

  @Get('resources')
  getResources() {
    return this.svc.getCrisisResources();
  }

  @Post('trigger')
  trigger(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { signal?: string },
  ) {
    return this.svc.triggerPanicMode(user.id, orgId, body.signal ?? 'panic_button_pressed');
  }

  @Post('grounding/start')
  startGrounding(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { flowKey: string },
  ) {
    return this.svc.startGroundingSession(user.id, orgId, body.flowKey);
  }

  @Patch('grounding/:sessionId/complete')
  completeGrounding(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() body: { completedSteps: number; feelingAfter?: number },
  ) {
    return this.svc.completeGroundingSession(sessionId, user.id, body.completedSteps, body.feelingAfter);
  }

  @Post('check-in')
  checkIn(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { safeNow: boolean; notes?: string },
  ) {
    return this.svc.checkInAfterCrisis(user.id, orgId, body.safeNow, body.notes);
  }

  @Get('history')
  history(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.svc.getSafetyHistory(user.id, orgId);
  }
}
