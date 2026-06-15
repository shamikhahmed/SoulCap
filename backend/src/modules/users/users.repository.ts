import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { memberships: { where: { deletedAt: null }, include: { organization: true } } },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findFirst({
      where: { clerkId, deletedAt: null },
      include: { memberships: { where: { deletedAt: null }, include: { organization: true } } },
    });
  }

  async create(data: { clerkId: string; email: string; firstName?: string; lastName?: string }) {
    return this.prisma.user.create({ data });
  }

  async updateProfile(userId: string, data: Partial<{ firstName: string; lastName: string; displayName: string; avatarUrl: string; timezone: string; locale: string; bio: string }>) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async upsertProfile(userId: string, organizationId: string, data: Partial<{
    dateOfBirth: Date; gender: string; pronouns: string; occupation: string;
    location: string; bio: string; hasTherapist: boolean; hasMedication: boolean;
    hasDiagnosis: boolean; referralSource: string;
  }>) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, organizationId, ...data },
      update: { ...data },
    });
  }

  async completeOnboarding(userId: string, organizationId: string, consents: { lmm: boolean; retention: boolean; research: boolean }) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        organizationId,
        onboardingComplete: true,
        onboardingCompletedAt: new Date(),
        consentLmmProfiling: consents.lmm,
        consentDataRetention: consents.retention,
        consentResearch: consents.research,
        consentGivenAt: new Date(),
      },
      update: {
        onboardingComplete: true,
        onboardingCompletedAt: new Date(),
        consentLmmProfiling: consents.lmm,
        consentDataRetention: consents.retention,
        consentResearch: consents.research,
        consentGivenAt: new Date(),
      },
    });
  }

  async softDelete(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
