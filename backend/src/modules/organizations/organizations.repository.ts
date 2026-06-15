import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.organization.findUnique({ where: { id, deletedAt: null } });
  }

  async create(data: { name: string; slug: string }) {
    return this.prisma.organization.create({ data });
  }

  async update(id: string, data: { name?: string; logoUrl?: string; settings?: object }) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async getMembersWithRoles(organizationId: string) {
    return this.prisma.membership.findMany({
      where: { organizationId, deletedAt: null },
      include: { user: { select: { id: true, email: true, displayName: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
  }
}
