import { PrismaService } from '../../database/prisma/prisma.service';
import { PaginationParams, PaginatedResult } from '../types';

export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}

  protected paginate<T>(
    data: T[],
    total: number,
    params: PaginationParams,
  ): PaginatedResult<T> {
    const { page, limit } = params;
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  protected skip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  protected orgWhere(organizationId: string, extra: Record<string, unknown> = {}) {
    return { organizationId, deletedAt: null, ...extra };
  }
}
