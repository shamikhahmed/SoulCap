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

    let event: ClerkWebhookEvent;
    try {
      event = wh.verify(req.rawBody as string, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch {
      throw new BadRequestException('Invalid Clerk webhook signature');
    }

    this.logger.log(`Clerk webhook: ${event.type}`);

    switch (event.type) {
      case 'user.created':
        await this.handleUserCreated(event.data as ClerkUserCreatedData);
        break;
      case 'user.updated':
        await this.handleUserUpdated(event.data as ClerkUserUpdatedData);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(event.data as { id: string });
        break;
      case 'organizationMembership.created':
        await this.handleMembershipCreated(event.data as ClerkMembershipData);
        break;
      case 'organizationMembership.deleted':
        await this.handleMembershipDeleted(event.data as ClerkMembershipData);
        break;
      default:
        this.logger.debug(`Unhandled Clerk event: ${event.type}`);
    }

    return { received: true };
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

interface ClerkUserUpdatedData extends ClerkUserCreatedData {}

interface ClerkMembershipData {
  role: string;
  organization?: { id: string; name: string };
  public_user_data?: { user_id: string };
}
