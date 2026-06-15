import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly posthog: PostHog | null = null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('posthog.apiKey');
    const host = this.config.get<string>('posthog.host', 'https://app.posthog.com');
    if (apiKey) {
      this.posthog = new PostHog(apiKey, { host, flushAt: 20, flushInterval: 10_000 });
    }
  }

  track(userId: string, event: string, properties?: Record<string, unknown>) {
    if (!this.posthog) return;
    try {
      this.posthog.capture({ distinctId: userId, event, properties: { ...properties, $lib: 'living-mind-backend' } });
    } catch (err) {
      this.logger.warn(`PostHog track failed: ${String(err)}`);
    }
  }

  identify(userId: string, traits: Record<string, unknown>) {
    if (!this.posthog) return;
    try {
      this.posthog.identify({ distinctId: userId, properties: traits });
    } catch (err) {
      this.logger.warn(`PostHog identify failed: ${String(err)}`);
    }
  }

  groupIdentify(orgId: string, properties: Record<string, unknown>) {
    if (!this.posthog) return;
    try {
      this.posthog.groupIdentify({ groupType: 'organization', groupKey: orgId, properties });
    } catch (err) {
      this.logger.warn(`PostHog groupIdentify failed: ${String(err)}`);
    }
  }

  async onApplicationShutdown() {
    await this.posthog?.shutdown();
  }
}
