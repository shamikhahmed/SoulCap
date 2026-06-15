import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GoalCompletedEvent, GoalMilestoneReachedEvent } from '../../events/contracts/domain.events';
import { GoalStatus, GoalDomain } from '@prisma/client';

@Injectable()
export class GoalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(
    userId: string,
    organizationId: string,
    data: { title: string; description?: string; domain?: GoalDomain; targetDate?: Date; milestones?: string[] },
  ) {
    const goal = await this.prisma.goal.create({
      data: {
        userId,
        organizationId,
        title: data.title,
        description: data.description,
        domain: data.domain ?? GoalDomain.WELLBEING,
        targetDate: data.targetDate,
      },
    });

    if (data.milestones?.length) {
      await this.prisma.goalMilestone.createMany({
        data: data.milestones.map((title, idx) => ({ goalId: goal.id, userId, title, order: idx })),
      });
    }

    return goal;
  }

  async list(userId: string, organizationId: string) {
    return this.prisma.goal.findMany({
      where: { userId, organizationId, deletedAt: null, status: { not: GoalStatus.ABANDONED } },
      orderBy: { createdAt: 'desc' },
      include: { milestones: { orderBy: { order: 'asc' } } },
    });
  }

  async updateProgress(goalId: string, userId: string, progress: number) {
    const goal = await this.prisma.goal.findFirst({ where: { id: goalId, userId, deletedAt: null } });
    if (!goal) throw new NotFoundException('Goal not found');

    const clamped = Math.max(0, Math.min(1, progress));
    const isCompleted = clamped >= 1.0 && goal.status !== GoalStatus.COMPLETED;

    const updated = await this.prisma.goal.update({
      where: { id: goalId },
      data: {
        progress: clamped,
        ...(isCompleted && { status: GoalStatus.COMPLETED, completedAt: new Date() }),
      },
    });

    if (isCompleted) {
      this.events.emit('goal.completed', new GoalCompletedEvent(userId, goal.organizationId, goalId, goal.title, goal.domain));
    }

    return updated;
  }

  async completeMilestone(goalId: string, userId: string, milestoneId: string) {
    const milestone = await this.prisma.goalMilestone.findFirst({
      where: { id: milestoneId, goalId },
    });
    if (!milestone) throw new NotFoundException('Milestone not found');

    const updated = await this.prisma.goalMilestone.update({
      where: { id: milestoneId },
      data: { completed: true, completedAt: new Date() },
    });

    this.events.emit('goal.milestone.reached', new GoalMilestoneReachedEvent(userId, goalId, milestoneId, milestone.title));
    return updated;
  }

  async abandon(goalId: string, userId: string) {
    return this.prisma.goal.update({
      where: { id: goalId },
      data: { status: GoalStatus.ABANDONED, deletedAt: new Date() },
    });
  }
}
