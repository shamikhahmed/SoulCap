import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, data: { title?: string; content: string; mood?: string; tags?: string[] }) {
    return this.prisma.journalEntry.create({
      data: { userId, organizationId, ...data },
    });
  }

  async list(userId: string, organizationId: string, limit = 20, cursor?: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId, organizationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  }

  async findById(id: string, userId: string) {
    const entry = await this.prisma.journalEntry.findFirst({ where: { id, userId, deletedAt: null } });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async update(id: string, userId: string, data: { title?: string; content?: string; mood?: string; tags?: string[] }) {
    return this.prisma.journalEntry.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  async softDelete(id: string, userId: string) {
    return this.prisma.journalEntry.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
