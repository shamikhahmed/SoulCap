import { SafetyGateService } from './safety-gate.service';

describe('SafetyGateService.quickScan', () => {
  const gate = new SafetyGateService({ get: () => undefined } as never);

  it('tier 3 on hard crisis phrasing', () => {
    expect(gate.quickScan('I want to kill myself')).toBe(3);
    expect(gate.quickScan('thinking about suicide tonight')).toBe(3);
  });

  it('tier 2 on elevated despair without hard rail', () => {
    expect(gate.quickScan('I feel completely hopeless and nothing matters')).toBe(2);
  });

  it('tier 0 on ordinary check-in', () => {
    expect(gate.quickScan('Had a long day but feeling okay')).toBe(0);
  });

  it('blocks therapist-identity hard rail', () => {
    expect(gate.checkHardRails('As your therapist I recommend…')).toBe('claiming_therapist_identity');
  });

  it('blocks diagnosis hard rail', () => {
    expect(gate.checkHardRails('You may have depression')).toBe('clinical_diagnosis');
  });
});
