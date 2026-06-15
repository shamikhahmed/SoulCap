import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { HabitService } from './habit.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { HabitFrequency } from '@prisma/client';

@Controller({ path: 'habits', version: '1' })
export class HabitController {
  constructor(private readonly habits: HabitService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { name: string; description?: string; frequency: HabitFrequency; targetDays?: number[]; reminderTime?: string },
  ) {
    return this.habits.create(user.id, orgId, body);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @OrgId() orgId: string) {
    return this.habits.list(user.id, orgId);
  }

  @Post(':id/complete')
  logCompletion(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Param('id') habitId: string,
    @Body() body: { note?: string },
  ) {
    return this.habits.logCompletion(habitId, user.id, orgId, body.note);
  }

  @Delete(':id')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id') habitId: string) {
    return this.habits.archive(habitId, user.id);
  }
}
