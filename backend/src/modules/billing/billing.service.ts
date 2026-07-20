import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../database/prisma/prisma.service';
import { SubscriptionStatus, SubscriptionTier } from '@prisma/client';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Pinned to the version `stripe@16.12.0` ships types for. Bump both together.
    this.stripe = new Stripe(this.config.getOrThrow<string>('stripe.secretKey'), { apiVersion: '2024-06-20' });
    this.webhookSecret = this.config.getOrThrow<string>('stripe.webhookSecret');
  }

  async createCheckoutSession(organizationId: string, userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    const stripeCustomer = await this.getOrCreateStripeCustomer(organizationId);

    return this.stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { organizationId, userId },
    });
  }

  async createPortalSession(organizationId: string, returnUrl: string) {
    const stripeCustomer = await this.prisma.stripeCustomer.findFirst({ where: { organizationId } });
    if (!stripeCustomer) throw new BadRequestException('No billing account found');

    return this.stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      return_url: returnUrl,
    });
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        this.logger.warn(`Payment failed for customer ${(event.data.object as Stripe.Invoice).customer}`);
        break;
    }

    return { received: true };
  }

  private async getOrCreateStripeCustomer(organizationId: string) {
    const existing = await this.prisma.stripeCustomer.findFirst({ where: { organizationId } });
    if (existing) return existing;

    const org = await this.prisma.organization.findUniqueOrThrow({ where: { id: organizationId } });
    const stripeCustomer = await this.stripe.customers.create({ name: org.name, metadata: { organizationId } });

    return this.prisma.stripeCustomer.create({
      data: { organizationId, stripeCustomerId: stripeCustomer.id, name: org.name },
    });
  }

  private async syncSubscription(sub: Stripe.Subscription) {
    const stripeCustomerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    const localCustomer = await this.prisma.stripeCustomer.findFirst({ where: { stripeCustomerId } });
    if (!localCustomer) return;

    const priceId = sub.items.data[0]?.price?.id;
    const tier = this.resolveTier(priceId);
    const status = this.resolveStatus(sub.status);

    await this.prisma.subscription.upsert({
      where: { stripeSubscriptionId: sub.id },
      create: {
        organizationId: localCustomer.organizationId,
        stripeCustomerId: localCustomer.id,
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId ?? '',
        tier,
        status,
        currentPeriodStart: new Date((sub.current_period_start ?? 0) * 1000),
        currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000),
      },
      update: {
        tier,
        status,
        stripePriceId: priceId ?? '',
        currentPeriodStart: new Date((sub.current_period_start ?? 0) * 1000),
        currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000),
      },
    });
  }

  private async handleSubscriptionDeleted(sub: Stripe.Subscription) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: SubscriptionStatus.CANCELED, canceledAt: new Date() },
    });
  }

  private resolveTier(priceId?: string): SubscriptionTier {
    const priceIds = this.config.get<Record<string, string>>('stripe.priceIds') ?? {};
    if (priceId === priceIds.proMonthly || priceId === priceIds.proAnnual) return SubscriptionTier.PRO;
    if (priceId === priceIds.teamMonthly) return SubscriptionTier.TEAM;
    return SubscriptionTier.FREE;
  }

  private resolveStatus(status: string): SubscriptionStatus {
    const map: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.ACTIVE,
      trialing: SubscriptionStatus.TRIALING,
      past_due: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELED,
      unpaid: SubscriptionStatus.UNPAID,
    };
    return map[status] ?? SubscriptionStatus.INCOMPLETE;
  }
}
