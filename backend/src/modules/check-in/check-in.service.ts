import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LivingMindService } from '../living-mind/living-mind.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckInCompletedEvent } from '../../events/contracts/domain.events';
import { SubmitCheckInDto } from './dto/check-in.dto';

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lmm: LivingMindService,
    private readonly events: EventEmitter2,
  ) {}

  async submit(userId: string, organizationId: string, dto: SubmitCheckInDto) {
    const salience = Math.abs(dto.valence) * 0.6 + (1 - dto.groundedness) * 0.4;

    const checkIn = await this.prisma.checkIn.create({
      data: {
        userId,
        organizationId,
        valence: dto.valence,
        arousal: dto.arousal,
        groundedness: dto.groundedness,
        emotions: dto.emotions ?? [],
        energyLevel: dto.energyLevel,
        freeText: dto.freeText ?? null,
        aiInsight: this.getTemplatedOpener(dto),
      },
    });

    const emotionalState = {
      valence: dto.valence,
      arousal: dto.arousal,
      groundedness: dto.groundedness,
      dominantEmotions: dto.emotions ?? [],
      intensity: salience,
      updatedAt: new Date().toISOString(),
    };

    void this.prisma.emotionalState.create({
      data: {
        userId,
        organizationId,
        valence: dto.valence,
        arousal: dto.arousal,
        groundedness: dto.groundedness,
        dominantEmotions: dto.emotions ?? [],
        intensity: salience,
        source: 'CHECK_IN',
        contextId: checkIn.id,
        contextType: 'check_in',
      },
    });

    void this.lmm.updateFromInteraction(userId, organizationId, {
      emotionalState,
      strategyUsed: 'CHECK_IN',
    });

    this.events.emit(CheckInCompletedEvent.EVENT, new CheckInCompletedEvent(
      userId, organizationId, checkIn.id, dto.valence, dto.arousal, dto.emotions ?? [],
    ));

    return { checkInId: checkIn.id, aiOpener: checkIn.aiInsight };
  }

  async getHistory(userId: string, organizationId: string, limit = 30) {
    return this.prisma.checkIn.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getTodayCheckIn(userId: string, organizationId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.checkIn.findFirst({
      where: { userId, organizationId, createdAt: { gte: today } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private getTemplatedOpener(dto: SubmitCheckInDto): string {
    if (dto.valence < -0.5) return "That sounds like a hard moment. What's weighing on you most right now?";
    if (dto.valence > 0.4) return "Glad you checked in. What's been good today?";
    if (dto.emotions?.includes('anxious') || dto.emotions?.includes('worried')) return "I notice anxiety is here with you. What's on your mind?";
    return "Thanks for checking in. What's present for you right now?";
  }
}
