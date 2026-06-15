import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { GoalDomain } from '@prisma/client';

@Controller({ path: 'goals', version: '1' })
export class GoalController {
  constructor(private readonly goals: GoalService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { title: string; description?: string; domain?: GoalDomain; targetDate?: Date; milestones?: string[] },
  ) {
    return this.goals.create(user.id, orgId, body);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.goals.list(user.id, orgId);
  }

  @Patch(':id/progress')
  updateProgress(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: { progress: number }) {
    return this.goals.updateProgress(id, user.id, body.progress);
  }

  @Post(':id/milestones/:milestoneId/complete')
  completeMilestone(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Param('milestoneId') milestoneId: string) {
    return this.goals.completeMilestone(id, user.id, milestoneId);
  }

  @Delete(':id')
  abandon(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.goals.abandon(id, user.id);
  }
}
