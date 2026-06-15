import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HabitStreakAchievedEvent } from '../../events/contracts/domain.events';
import { HabitFrequency, HabitStatus } from '@prisma/client';

@Injectable()
export class HabitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(
    userId: string,
    organizationId: string,
    data: { name: string; description?: string; frequency: HabitFrequency; reminderTime?: string; reminderDays?: string[] },
  ) {
    return this.prisma.habit.create({
      data: { userId, organizationId, name: data.name, description: data.description, targetFrequency: data.frequency, reminderTime: data.reminderTime, reminderDays: data.reminderDays ?? [] },
    });
  }

  async list(userId: string, organizationId: string) {
    return this.prisma.habit.findMany({
      where: { userId, organizationId, status: HabitStatus.ACTIVE, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async logCompletion(habitId: string, userId: string, organizationId: string, note?: string) {
    const habit = await this.prisma.habit.findFirst({ where: { id: habitId, userId, deletedAt: null } });
    if (!habit) throw new NotFoundException('Habit not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyLogged = await this.prisma.habitLog.findFirst({
      where: { habitId, userId, completedAt: { gte: today } },
    });
    if (alreadyLogged) return { alreadyLogged: true };

    await this.prisma.habitLog.create({ data: { habitId, userId, completedAt: new Date(), note } });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const wasStreakAlive = habit.lastTracked && habit.lastTracked >= yesterday;

    const newStreak = wasStreakAlive ? habit.streakCurrent + 1 : 1;
    const newBest = Math.max(habit.streakBest, newStreak);

    await this.prisma.habit.update({
      where: { id: habitId },
      data: { streakCurrent: newStreak, streakBest: newBest, lastTracked: new Date(), totalLogs: { increment: 1 } },
    });

    if (newStreak > 0 && newStreak % 7 === 0) {
      this.events.emit('habit.streak.achieved', new HabitStreakAchievedEvent(userId, habitId, habit.name, newStreak));
    }

    return { logged: true, streakCurrent: newStreak, streakBest: newBest };
  }

  async archive(habitId: string, userId: string) {
    return this.prisma.habit.update({
      where: { id: habitId },
      data: { status: HabitStatus.ARCHIVED, deletedAt: new Date() },
    });
  }
}
