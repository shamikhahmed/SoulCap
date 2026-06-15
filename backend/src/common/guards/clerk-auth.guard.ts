import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createClerkClient } from '@clerk/backend';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly clerk;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {
    this.clerk = createClerkClient({ secretKey: this.config.get('clerk.secretKey') });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('No authorization token');

    let clerkPayload: Awaited<ReturnType<typeof this.clerk.verifyToken>>;
    try {
      clerkPayload = await this.clerk.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.prisma.user.findFirst({
      where: { clerkId: clerkPayload.sub, deletedAt: null },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          orderBy: { joinedAt: 'asc' },
          take: 1,
        },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const orgIdHeader = request.headers['x-organization-id'] as string;
    const membership = user.memberships.find((m) => m.organizationId === orgIdHeader)
      ?? user.memberships[0];

    if (!membership) throw new UnauthorizedException('No active organization membership');

    request['user'] = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    return true;
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.substring(7);
    return null;
  }
}
