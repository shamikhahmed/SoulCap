import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { Public } from '../../common/decorators/public.decorator';

@Controller({ path: 'billing', version: '1' })
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('checkout')
  createCheckout(
    @CurrentUser() user: AuthenticatedUser,
    @OrgId() orgId: string,
    @Body() body: { priceId: string; successUrl: string; cancelUrl: string },
  ) {
    return this.billing.createCheckoutSession(orgId, user.id, body.priceId, body.successUrl, body.cancelUrl);
  }

  @Post('portal')
  createPortal(@OrgId() orgId: string, @Body() body: { returnUrl: string }) {
    return this.billing.createPortalSession(orgId, body.returnUrl);
  }

  @Public()
  @Post('webhooks/stripe')
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.billing.handleWebhook(req.rawBody as Buffer, signature);
  }
}
