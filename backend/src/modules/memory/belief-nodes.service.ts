import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class BeliefNodesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDisplayEligible(userId: string, limit = 8) {
    return this.prisma.memoryItem.findMany({
      where: { userId, displayEligible: true, deletedAt: null, userRejected: false },
      orderBy: { relevance: 'desc' },
      take: limit,
    });
  }

  async getByDomain(userId: string, domain: string) {
    return this.prisma.memoryItem.findMany({
      where: { userId, domain, deletedAt: null },
      orderBy: { confidence: 'desc' },
    });
  }

  async findContradictions(userId: string) {
    return this.prisma.memoryItem.findMany({
      where: { userId, contradictions: { isEmpty: false }, deletedAt: null },
    });
  }

  async markUserValidated(memoryItemId: string, validated: boolean) {
    return this.prisma.memoryItem.update({
      where: { id: memoryItemId },
      data: { userValidated: validated, userRejected: !validated, lastValidatedAt: new Date() },
    });
  }

  async inferFromEmotionalEvent(
    userId: string,
    organizationId: string,
    opts: { emotionType: string; trigger?: string; frequency: number },
  ) {
    if (opts.frequency < 3 || !opts.trigger) return;
    const content = `Tends to feel ${opts.emotionType} when ${opts.trigger}`;
    const existing = await this.prisma.memoryItem.findFirst({
      where: { userId, domain: 'AFFECTIVE', subdomain: 'trigger_response_map', content, deletedAt: null },
    });
    if (existing) {
      await this.prisma.memoryItem.update({
        where: { id: existing.id },
        data: { confidence: Math.min(1, existing.confidence + 0.1), updatedAt: new Date() },
      });
    }
  }
}
