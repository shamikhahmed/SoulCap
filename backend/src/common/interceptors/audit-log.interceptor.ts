import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../types';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    if (!WRITE_METHODS.has(req.method)) return next.handle();

    const user: AuthenticatedUser | undefined = req['user'];
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          if (!user) return;
          void this.prisma.auditLog.create({
            data: {
              userId: user.id,
              organizationId: user.organizationId,
              action: `${req.method} ${req.route?.path ?? req.url}`,
              resource: req.route?.path ?? req.url,
              resourceId: req.params?.id,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
              requestId: req.headers['x-request-id'] as string,
              success: true,
              metadata: { durationMs: Date.now() - startTime },
            },
          });
        },
        error: (err: Error & { status?: number }) => {
          if (!user) return;
          void this.prisma.auditLog.create({
            data: {
              userId: user.id,
              organizationId: user.organizationId,
              action: `${req.method} ${req.route?.path ?? req.url}`,
              resource: req.route?.path ?? req.url,
              resourceId: req.params?.id,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
              requestId: req.headers['x-request-id'] as string,
              success: false,
              errorCode: String(err.status ?? 500),
              metadata: { error: err.message, durationMs: Date.now() - startTime },
            },
          });
        },
      }),
    );
  }
}
