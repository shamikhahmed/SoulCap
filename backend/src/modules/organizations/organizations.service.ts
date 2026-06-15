import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
  constructor(private readonly repo: OrganizationsRepository) {}

  async findById(id: string) {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async getMembers(organizationId: string) {
    return this.repo.getMembersWithRoles(organizationId);
  }

  async updateSettings(organizationId: string, data: { name?: string; logoUrl?: string }) {
    return this.repo.update(organizationId, data);
  }
}
