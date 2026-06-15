import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto, UpdateExtendedProfileDto, CompleteOnboardingDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByClerkId(clerkId: string) {
    return this.repo.findByClerkId(clerkId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.repo.updateProfile(userId, dto);
  }

  async softDelete(userId: string) {
    return this.repo.softDelete(userId);
  }

  async getProfile(userId: string) {
    return this.repo.getProfile(userId);
  }

  async updateExtendedProfile(userId: string, organizationId: string, dto: UpdateExtendedProfileDto) {
    return this.repo.upsertProfile(userId, organizationId, {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
  }

  async completeOnboarding(userId: string, organizationId: string, dto: CompleteOnboardingDto) {
    return this.repo.completeOnboarding(userId, organizationId, {
      lmm: dto.consentLmmProfiling ?? false,
      retention: dto.consentDataRetention ?? false,
      research: dto.consentResearch ?? false,
    });
  }

  async getOrCreateByClerk(clerkId: string, email: string, firstName?: string, lastName?: string) {
    const existing = await this.repo.findByClerkId(clerkId);
    if (existing) return existing;
    return this.repo.create({ clerkId, email, firstName, lastName });
  }
}
