import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../types';

/** Express request after this guard has attached the resolved user. */
type AuthedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly secretKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {
    this.secretKey = this.config.get<string>('clerk.secretKey') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('No authorization token');

    let clerkPayload: Awaited<ReturnType<typeof verifyToken>>;
    try {
      clerkPayload = await verifyToken(token, { secretKey: this.secretKey });
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
    const membership =
      user.memberships.find((m: (typeof user.memberships)[number]) => m.organizationId === orgIdHeader)
      ?? user.memberships[0];

    if (!membership) throw new UnauthorizedException('No active organization membership');

    request.user = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    return true;
  }

  private extractToken(request: AuthedRequest): string | null {
    const auth = request.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.substring(7);
    return null;
  }
}
