import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SafetySignals, AIMode, ResponseStrategy } from '../living-mind/living-mind.types';

export interface SafetyAssessment {
  tier: 0 | 1 | 2 | 3;
  requiresModeOverride: boolean;
  overrideMode?: AIMode;
  overrideStrategy?: ResponseStrategy;
  protocolResponse?: string;
  escalationRequired: boolean;
}

// Hard rails: patterns that trigger mandatory crisis response regardless of AI analysis
const CRISIS_KEYWORDS = [
  'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
  'hurt myself', 'cut myself', 'overdose', 'not worth living',
  "don't want to be here", 'no reason to live', 'everyone would be better',
  'saying goodbye', 'giving away', 'farewell',
];

const TIER_2_KEYWORDS = [
  'think about dying', 'wish i was dead', 'fantasize about death',
  'nothing matters', 'completely hopeless', 'no way out', 'never gets better',
  "can't go on", 'too much pain', 'done with everything',
];

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name);
  private readonly crisisWebhookUrl: string | undefined;

  constructor(config: ConfigService) {
    this.crisisWebhookUrl = config.get<string>('CRISIS_WEBHOOK_URL');
  }

  assess(safetySignals: SafetySignals, rawMessage: string): SafetyAssessment {
    // Hard rail: keyword scan always runs regardless of AI signal
    const messageLower = rawMessage.toLowerCase();
    const hardRailTrigger = CRISIS_KEYWORDS.some((kw) => messageLower.includes(kw));
    const tier2Trigger = TIER_2_KEYWORDS.some((kw) => messageLower.includes(kw));

    let effectiveTier = safetySignals.tier;
    if (hardRailTrigger) effectiveTier = 3;
    else if (tier2Trigger && effectiveTier < 2) effectiveTier = 2;

    if (effectiveTier === 3) {
      this.logCrisisEvent(rawMessage, safetySignals.signals);
      return {
        tier: 3,
        requiresModeOverride: true,
        overrideMode: AIMode.CRISIS,
        overrideStrategy: ResponseStrategy.RESOURCE,
        protocolResponse: this.buildTier3Response(),
        escalationRequired: true,
      };
    }

    if (effectiveTier === 2) {
      return {
        tier: 2,
        requiresModeOverride: true,
        overrideMode: AIMode.CRISIS,
        overrideStrategy: ResponseStrategy.GROUND,
        escalationRequired: false,
      };
    }

    if (effectiveTier === 1) {
      return {
        tier: 1,
        requiresModeOverride: false,
        escalationRequired: false,
      };
    }

    return {
      tier: 0,
      requiresModeOverride: false,
      escalationRequired: false,
    };
  }

  private buildTier3Response(): string {
    return [
      "I can hear that you're in real pain right now, and I'm glad you're talking.",
      '',
      "What you're feeling matters. You matter.",
      '',
      'Right now, the most important thing is that you speak with someone who can truly be there for you:',
      '',
      '**988 Suicide & Crisis Lifeline** — call or text **988** (US)',
      '**Crisis Text Line** — text HOME to **741741**',
      '**International Association for Suicide Prevention** — https://www.iasp.info/resources/Crisis_Centres/',
      '',
      "If you're in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.",
      '',
      "I'm here with you right now. Can you tell me if you're safe?",
    ].join('\n');
  }

  private logCrisisEvent(message: string, signals: string[]) {
    // Log the event (without storing raw message content in logs)
    this.logger.warn(`TIER-3 SAFETY EVENT DETECTED. Signals: ${signals.join(', ')}`);

    if (this.crisisWebhookUrl) {
      // Fire-and-forget webhook notification (does not include message content)
      fetch(this.crisisWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'CRISIS_TIER_3',
          signals,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => this.logger.error('Crisis webhook failed', err));
    }
  }

  // Hard rails — these are ALWAYS enforced regardless of context
  enforcesHardRails(content: string): { violated: boolean; violation?: string } {
    const lower = content.toLowerCase();

    if (lower.includes('you are a therapist') || lower.includes('as your therapist')) {
      return { violated: true, violation: 'claiming_therapist_identity' };
    }
    if (/you (have|may have|likely have) (depression|anxiety|bipolar|ptsd|bpd|adhd)/i.test(content)) {
      return { violated: true, violation: 'clinical_diagnosis' };
    }

    return { violated: false };
  }
}
