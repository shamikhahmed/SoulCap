import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { InterventionService } from './intervention.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'interventions', version: '1' })
export class InterventionController {
  constructor(private readonly svc: InterventionService) {}

  @Get('history')
  history(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.svc.getUserHistory(user.id, orgId);
  }

  @Get('coping')
  getCoping(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.svc.getCopingMechanisms(user.id, orgId);
  }

  @Post('coping')
  addCoping(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { name: string; description?: string; category: string; isHealthy?: boolean },
  ) {
    return this.svc.addCopingMechanism(user.id, orgId, body);
  }

  @Patch('coping/:id/rate')
  rateCoping(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { effectiveness: number },
  ) {
    return this.svc.rateCopingMechanism(id, user.id, body.effectiveness);
  }

  @Get('activities')
  getActivities(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.svc.getSuggestedActivities(user.id, orgId);
  }

  @Post('activities/:id/complete')
  completeActivity(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { feedback?: string },
  ) {
    return this.svc.completeActivity(id, user.id, body.feedback);
  }

  @Get('triggers')
  getTriggers(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.svc.getTriggers(user.id, orgId);
  }

  @Post('triggers')
  addTrigger(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { name: string; category: string; description?: string; intensity?: number },
  ) {
    return this.svc.addTrigger(user.id, orgId, body);
  }
}
