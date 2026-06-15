import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as apn from 'apn';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly apnProvider: apn.Provider | null = null;
  private readonly bundleId: string;

  constructor(private readonly config: ConfigService) {
    const keyId = this.config.get<string>('apns.keyId');
    const teamId = this.config.get<string>('apns.teamId');
    const key = this.config.get<string>('apns.key');
    this.bundleId = this.config.get<string>('apns.bundleId', 'com.livingmind.app');

    if (keyId && teamId && key) {
      this.apnProvider = new apn.Provider({
        token: { key, keyId, teamId },
        production: this.config.get('app.env') === 'production',
      });
    }
  }

  async sendPushToToken(token: string, payload: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    badge?: number;
  }) {
    if (!this.apnProvider) {
      this.logger.debug('APNs not configured, skipping push');
      return;
    }

    const notification = new apn.Notification();
    notification.alert = { title: payload.title, body: payload.body };
    notification.badge = payload.badge ?? 1;
    notification.sound = 'default';
    notification.payload = payload.data ?? {};
    notification.topic = this.bundleId;

    const result = await this.apnProvider.send(notification, token);
    if (result.failed.length) {
      this.logger.warn(`APNs failed: ${JSON.stringify(result.failed[0]?.response)}`);
    }
    return result;
  }

  async sendPush(userId: string, payload: { title: string; body: string; data?: Record<string, unknown>; badge?: number }) {
    this.logger.debug(`Push notification queued for user ${userId}: ${payload.title}`);
  }

  async onApplicationShutdown() {
    this.apnProvider?.shutdown();
  }
}
