import {
  Controller,
  Post,
  Headers,
  Body,
  BadRequestException,
  Logger,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

interface ClerkWebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: unknown,
  ) {
    const secret = this.config.getOrThrow<string>('clerk.webhookSecret');
    const wh = new Webhook(secret);

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body — rawBody must be enabled on the Nest app');
    }

    let event: ClerkWebhookEvent;
    try {
      event = wh.verify(req.rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch {
      throw new BadRequestException('Invalid Clerk webhook signature');
    }

    this.logger.log(`Clerk webhook: ${event.type}`);

    // The signature is verified above, so the sender is genuinely Clerk — but the
    // payload *shape* still isn't guaranteed across their API changes. Narrow before use
    // so a changed field degrades to a logged skip instead of a runtime crash.
    switch (event.type) {
      case 'user.created':
        if (isUserData(event.data)) await this.handleUserCreated(event.data);
        else this.logUnexpected(event.type);
        break;
      case 'user.updated':
        if (isUserData(event.data)) await this.handleUserUpdated(event.data);
        else this.logUnexpected(event.type);
        break;
      case 'user.deleted':
        if (typeof event.data.id === 'string') await this.handleUserDeleted({ id: event.data.id });
        else this.logUnexpected(event.type);
        break;
      case 'organizationMembership.created':
        if (isMembershipData(event.data)) await this.handleMembershipCreated(event.data);
        else this.logUnexpected(event.type);
        break;
      case 'organizationMembership.deleted':
        if (isMembershipData(event.data)) await this.handleMembershipDeleted(event.data);
        else this.logUnexpected(event.type);
        break;
      default:
        this.logger.debug(`Unhandled Clerk event: ${event.type}`);
    }

    return { received: true };
  }

  private logUnexpected(eventType: string) {
    this.logger.warn(`Clerk webhook ${eventType} had an unexpected payload shape — skipped`);
  }

  private async handleUserCreated(data: ClerkUserCreatedData) {
    const email = data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address;
    if (!email) return;

    await this.prisma.user.upsert({
      where: { clerkId: data.id },
      create: {
        clerkId: data.id,
        email,
        firstName: data.first_name ?? null,
        lastName: data.last_name ?? null,
        avatarUrl: data.image_url ?? null,
      },
      update: {
        email,
        firstName: data.first_name ?? null,
        lastName: data.last_name ?? null,
        avatarUrl: data.image_url ?? null,
      },
    });
  }

  private async handleUserUpdated(data: ClerkUserUpdatedData) {
    const email = data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address;
    await this.prisma.user.updateMany({
      where: { clerkId: data.id },
      data: {
        ...(email && { email }),
        firstName: data.first_name ?? undefined,
        lastName: data.last_name ?? undefined,
        avatarUrl: data.image_url ?? undefined,
      },
    });
  }

  private async handleUserDeleted(data: { id: string }) {
    await this.prisma.user.updateMany({
      where: { clerkId: data.id },
      data: { deletedAt: new Date() },
    });
  }

  private async handleMembershipCreated(data: ClerkMembershipData) {
    // Org-level membership syncing handled separately via org provisioning flow
    this.logger.log(`Membership created: user=${data.public_user_data?.user_id}, org=${data.organization?.id}`);
  }

  private async handleMembershipDeleted(data: ClerkMembershipData) {
    this.logger.log(`Membership deleted: user=${data.public_user_data?.user_id}, org=${data.organization?.id}`);
  }
}

interface ClerkUserCreatedData {
  id: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  primary_email_address_id?: string;
  email_addresses?: Array<{ id: string; email_address: string }>;
}

type ClerkUserUpdatedData = ClerkUserCreatedData;

interface ClerkMembershipData {
  role: string;
  organization?: { id: string; name: string };
  public_user_data?: { user_id: string };
}

function isUserData(data: Record<string, unknown>): data is ClerkUserCreatedData & Record<string, unknown> {
  return typeof data.id === 'string';
}

function isMembershipData(data: Record<string, unknown>): data is ClerkMembershipData & Record<string, unknown> {
  return typeof data.role === 'string';
}
