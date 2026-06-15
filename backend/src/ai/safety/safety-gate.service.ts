import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SafetyAssessmentResult, SafetySignalDto, SafetyTierValue } from '../../common/types';

// Unambiguous — no context needed, always Tier 3
const CRISIS_HARD = [
  'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
  'hurt myself', 'cut myself', 'overdose', 'not worth living',
  "don't want to be here", 'no reason to live', 'everyone would be better without me',
];

// Contextual — require co-occurrence with distress language
const CRISIS_CONTEXTUAL = [
  'saying goodbye', 'giving away', 'farewell', 'final note', 'last message',
];

const DISTRESS_CONTEXT = [
  'pain', 'hopeless', 'desperate', 'can\'t take', 'exhausted', 'done', 'over',
  'anymore', 'nothing left', 'end it', 'tired of living', 'worthless',
];

// Tier 2 signals
const ELEVATED_KEYWORDS = [
  'think about dying', 'wish i was dead', 'fantasize about death',
  'nothing matters', 'completely hopeless', 'no way out', 'never gets better',
  "can't go on", 'too much pain', 'done with everything', 'don\'t want to wake up',
];

const CRISIS_RESOURCES = [
  '**988 Suicide & Crisis Lifeline** — call or text **988** (US)',
  '**Crisis Text Line** — text HOME to **741741**',
  '**International Association for Suicide Prevention** — https://www.iasp.info/resources/Crisis_Centres/',
  '**Emergency services** — 911 (US) or your local emergency number',
];

const TIER_3_RESPONSE = [
  "I can hear that you're in real pain right now, and I'm glad you're talking.",
  '',
  "What you're feeling matters. You matter.",
  '',
  'The most important thing right now is that you speak with someone who can truly be there for you:',
  '',
  ...CRISIS_RESOURCES,
  '',
  "If you're in immediate danger, please call emergency services or go to your nearest emergency room.",
  '',
  "I'm here with you right now. Can you tell me if you're safe?",
].join('\n');

const TIER_2_POSTSCRIPT = '\n\n---\n*If things ever feel overwhelming, you can reach the 988 Suicide & Crisis Lifeline anytime — call or text 988.*';

@Injectable()
export class SafetyGateService {
  private readonly logger = new Logger(SafetyGateService.name);
  private readonly webhookUrl: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get<string>('safety.webhookUrl');
  }

  /** Run synchronously BEFORE any API call. Returns tier immediately from keywords. */
  quickScan(rawMessage: string): SafetyTierValue {
    const lower = rawMessage.toLowerCase();

    if (CRISIS_HARD.some((kw) => lower.includes(kw))) return 3;

    const hasContextualCrisis = CRISIS_CONTEXTUAL.some((kw) => lower.includes(kw));
    const hasDistressContext = DISTRESS_CONTEXT.some((kw) => lower.includes(kw));
    if (hasContextualCrisis && hasDistressContext) return 3;

    if (ELEVATED_KEYWORDS.some((kw) => lower.includes(kw))) return 2;

    return 0;
  }

  assess(aiSignals: SafetySignalDto, rawMessage: string): SafetyAssessmentResult {
    const keywordTier = this.quickScan(rawMessage);
    const effectiveTier = Math.max(keywordTier, aiSignals.tier) as SafetyTierValue;
    const hardRailTriggered = keywordTier === 3;

    if (effectiveTier === 3) {
      void this.logSafetyEvent(3, aiSignals.signals, hardRailTriggered);
      return {
        tier: 3,
        requiresOverride: true,
        signals: aiSignals.signals,
        hardRailTriggered,
        protocolResponse: TIER_3_RESPONSE,
        resourcesToProvide: CRISIS_RESOURCES,
      };
    }

    if (effectiveTier === 2) {
      return {
        tier: 2,
        requiresOverride: true,
        signals: aiSignals.signals,
        hardRailTriggered: false,
        resourcesToProvide: [CRISIS_RESOURCES[0]],
      };
    }

    return { tier: effectiveTier, requiresOverride: false, signals: aiSignals.signals, hardRailTriggered: false };
  }

  /** Inject mandatory resource postscript for Tier-2 responses */
  appendTier2Resources(response: string, tier: SafetyTierValue): string {
    if (tier === 2) return response + TIER_2_POSTSCRIPT;
    return response;
  }

  /** Returns null if valid. Returns error string if violated. */
  checkHardRails(content: string): string | null {
    const lower = content.toLowerCase();
    if (lower.includes('as your therapist') || lower.includes('i am your therapist')) {
      return 'claiming_therapist_identity';
    }
    if (/you (have|may have|likely have) (depression|anxiety|bipolar|ptsd|bpd|adhd)/i.test(content)) {
      return 'clinical_diagnosis';
    }
    return null;
  }

  private async logSafetyEvent(tier: SafetyTierValue, signals: string[], hardRail: boolean) {
    this.logger.warn(`SAFETY TIER-${tier} EVENT. Signals: ${signals.join(', ')} | HardRail: ${hardRail}`);

    if (this.webhookUrl) {
      try {
        await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: `SAFETY_TIER_${tier}`,
            signals,
            hardRailTriggered: hardRail,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        this.logger.error('Safety webhook failed', err);
      }
    }
  }
}
