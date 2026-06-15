import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LivingMindService } from './living-mind.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller({ path: 'mind-model', version: '1' })
export class LivingMindController {
  constructor(private readonly lmm: LivingMindService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.lmm.getSummary(user.id, orgId);
  }

  @Get('beliefs')
  getBeliefs(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.lmm.getDisplayBeliefs(user.id, orgId);
  }

  @Post('beliefs/:id/validate')
  validateBelief(
    @Param('id') beliefId: string,
    @Body() body: { accepted: boolean; note?: string },
  ) {
    return this.lmm.userValidatesBelief(beliefId, body.accepted, body.note);
  }

  @Post('snapshot')
  snapshot(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.lmm.snapshotModel(user.id, orgId);
  }
}
