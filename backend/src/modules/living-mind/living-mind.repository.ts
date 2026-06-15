import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class LivingMindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string, organizationId: string) {
    return this.prisma.livingMindModel.findFirst({
      where: { userId, organizationId, deletedAt: null },
    });
  }

  async findOrCreate(userId: string, organizationId: string) {
    const existing = await this.findByUserId(userId, organizationId);
    if (existing) return existing;
    return this.prisma.livingMindModel.create({
      data: { userId, organizationId },
    });
  }

  async update(id: string, data: object) {
    return this.prisma.livingMindModel.update({ where: { id }, data });
  }

  async snapshot(modelId: string, userId: string, organizationId: string, version: number, modelState: object, confidenceScore: number, trigger: string) {
    return this.prisma.mindSnapshot.create({
      data: {
        livingMindModelId: modelId,
        userId,
        organizationId,
        snapshotVersion: version,
        modelState,
        confidenceScore,
        triggerReason: trigger,
      },
    });
  }

  async getSnapshots(livingMindModelId: string, limit = 10) {
    return this.prisma.mindSnapshot.findMany({
      where: { livingMindModelId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
