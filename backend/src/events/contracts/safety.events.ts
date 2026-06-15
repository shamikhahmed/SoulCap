import { SafetyTier } from '../../common/types';

export class RiskDetectedEvent {
  static readonly EVENT = 'safety.risk.detected';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly riskAssessmentId: string,
    public readonly level: string,
    public readonly signals: string[],
    public readonly sourceType: string,
    public readonly sourceId: string,
  ) {}
}

export class SafetyFlagCreatedEvent {
  static readonly EVENT = 'safety.flag.created';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly safetyFlagId: string,
    public readonly tier: SafetyTier,
    public readonly signals: string[],
  ) {}
}

export class CrisisDetectedEvent {
  static readonly EVENT = 'safety.crisis.detected';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly safetyFlagId: string,
    public readonly signals: string[],
    public readonly sourceType: string,
  ) {}
}

export class SafetyEscalatedEvent {
  static readonly EVENT = 'safety.escalated';
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly safetyFlagId: string,
    public readonly tier: SafetyTier,
    public readonly webhookFired: boolean,
  ) {}
}
