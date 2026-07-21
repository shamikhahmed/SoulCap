import { test, expect, Page } from '@playwright/test';

/* Safety-critical behaviour. A failure in this file blocks release.
 * See Capricorn-Brain/AI/Claude-Code/SoulCap-Eval-Harness.md for the full spec;
 * these are the subset that can be asserted without a clinician-reviewed case set. */

/** Demo state, splash dismissed. Demo already marks welcome + onboarding done. */
async function seedDemo(page: Page) {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => !!(window as any).__soulcap);
  await dismissSplash(page);
}

/** The splash covers the viewport for ~2s. Tests dismiss it rather than wait. */
async function dismissSplash(page: Page) {
  await page.evaluate(() => document.getElementById('splash')?.classList.add('gone'));
  await page.waitForFunction(() => {
    const s = document.getElementById('splash');
    return !s || getComputedStyle(s).visibility === 'hidden';
  }, null, { timeout: 4000 });
}

/** Fresh install through the welcome screen to the age gate. */
async function toAgeGate(page: Page) {
  await page.goto('/');
  await dismissSplash(page);
  await page.getByRole('button', { name: 'Begin' }).click();
}

/** Full fresh onboarding into the app: age → name → consent → concerns (no country). */
async function freshThrough(page: Page) {
  await toAgeGate(page);
  await page.getByRole('button', { name: '18 or older' }).click();
  await page.getByRole('button', { name: 'Skip', exact: true }).click(); // name step
  await page.getByRole('button', { name: 'I understand' }).click();
  await page.getByRole('button', { name: /Skip — just let me in/ }).click();
}

test.describe('Safety kernel — risk tiers', () => {
  test('explicit crisis phrasing is tier 3', async ({ page }) => {
    await seedDemo(page);
    const phrases = [
      'i want to kill myself',
      'I have been thinking about ending my life',
      'there is no reason to live',
      "i don't want to be here anymore"
    ];
    for (const p of phrases) {
      const tier = await page.evaluate((s) => (window as any).__soulcap.assessRisk(s), p);
      expect(tier, `"${p}" must be tier 3`).toBe(3);
    }
  });

  test('contextual crisis needs distress co-occurrence', async ({ page }) => {
    await seedDemo(page);
    // "saying goodbye" alone is not a crisis signal.
    const alone = await page.evaluate(() =>
      (window as any).__soulcap.assessRisk('saying goodbye to my colleagues at the leaving do'));
    expect(alone).toBeLessThan(3);

    const withDistress = await page.evaluate(() =>
      (window as any).__soulcap.assessRisk('saying goodbye, i am so hopeless and in pain'));
    expect(withDistress).toBe(3);
  });

  test('elevated despair is tier 2', async ({ page }) => {
    await seedDemo(page);
    const tier = await page.evaluate(() =>
      (window as any).__soulcap.assessRisk('i feel completely hopeless and there is no way out'));
    expect(tier).toBe(2);
  });

  test('figurative language does not false-positive', async ({ page }) => {
    await seedDemo(page);
    // Over-triggering teaches people to edit themselves. Both directions matter.
    const benign = [
      'this deadline is killing me',
      'i am dying of boredom',
      'i could murder a coffee',
      'my phone died on the way home',
      'i am so dead tired today'
    ];
    for (const p of benign) {
      const tier = await page.evaluate((s) => (window as any).__soulcap.assessRisk(s), p);
      expect(tier, `"${p}" must not escalate`).toBeLessThan(2);
    }
  });
});

test.describe('Local-only spoken guidance', () => {
  test('remote-capable system voices are never used', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__spokenCount = 0;
      const remoteVoice = { name: 'Remote English', lang: 'en-US', localService: false };
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: {
          getVoices: () => [remoteVoice],
          cancel: () => {},
          speak: () => { (window as any).__spokenCount++; },
          onvoiceschanged: null
        }
      });
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: function (this: any, text: string) { this.text = text; }
      });
    });
    await seedDemo(page);
    await page.evaluate(() => {
      (window as any).__soulcap.getState().voice.on = true;
      (window as any).__soulcap.startSkill('grounding-54321');
    });
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => (window as any).__spokenCount)).toBe(0);
  });
});

test.describe('Help is always reachable', () => {
  test('installed Help shortcut opens help immediately', async ({ page }) => {
    await page.goto('/?demo=1&panic=1');
    await page.waitForFunction(() => !!(window as any).__soulcap);
    await expect(page.locator('#panic')).toBeVisible();
    await expect(page.locator('#panic')).toContainText('You don’t have to get through this alone');
  });

  test('every main screen exposes a help affordance', async ({ page }) => {
    await seedDemo(page);
    for (const tab of ['now', 'calm', 'journal', 'map', 'me']) {
      await page.evaluate((t) => {
        (document.querySelector(`#tabs button[data-tab="${t}"]`) as HTMLElement).click();
      }, tab);
      await expect(page.locator('.view.on .help-btn')).toBeVisible();
    }
  });

  test('help is reachable on the welcome screen, before anything is agreed', async ({ page }) => {
    await page.goto('/');
    await dismissSplash(page);
    await expect(page.locator('#view-welcome .help-btn')).toBeVisible();
  });

  test('help is reachable during onboarding, before consent', async ({ page }) => {
    await toAgeGate(page);
    await expect(page.locator('#view-onboarding .help-btn')).toBeVisible();
  });

  test('panic screen gives gentle reach-out guidance and exits in one tap', async ({ page }) => {
    await seedDemo(page);
    await page.locator('.view.on .help-btn').click();
    await expect(page.locator('#panic')).toBeVisible();

    // No phone numbers anywhere on the panic screen (owner decision).
    const text = await page.locator('#panic').innerText();
    expect(text).not.toMatch(/\b\d{3,}\b/); // no long digit strings (numbers/lines)
    expect(text.toLowerCase()).toContain('trust');
    // The one action opens the user's own messages, not a specific line.
    const msg = page.locator('#panicLinks a');
    expect(await msg.getAttribute('href')).toBe('sms:');

    await page.locator('#panicExit').click();
    await expect(page.locator('#panic')).toBeHidden();
  });

  test('persistent help button sits on every tab and opens help', async ({ page }) => {
    await seedDemo(page);
    for (const tab of ['now', 'calm', 'journal', 'map', 'me']) {
      await page.evaluate((t) => {
        (document.querySelector(`#tabs button[data-tab="${t}"]`) as HTMLElement).click();
      }, tab);
      await expect(page.locator('#fab')).toBeVisible();
    }
    await page.locator('#fab').click();
    await expect(page.locator('#panic')).toBeVisible();
  });

  test('no crisis numbers or country lines anywhere on the panic screen', async ({ page }) => {
    await seedDemo(page);
    await page.locator('.view.on .help-btn').click();
    const text = await page.locator('#panic').innerText();
    // No named lines, no country services, no phone numbers.
    for (const bad of ['Samaritans', 'Umang', 'Taskeen', '988', '741741', '116', '911', '999', '1122', 'IASP', 'Find a Helpline']) {
      expect(text, `panic screen must not contain "${bad}"`).not.toContain(bad);
    }
    expect(text).not.toContain('tel:');
  });

  test('voice starts silent on the panic screen (safe around people)', async ({ page }) => {
    await seedDemo(page);
    // Turn spoken guidance on globally first.
    await page.evaluate(() => { const s = (window as any).__soulcap.getState(); s.voice.on = true; });
    await page.locator('.view.on .help-btn').click();
    const toggle = page.locator('#panicVoice .voice-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false'); // muted by default
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true'); // one tap to enable if alone
  });

  test('choosing "around people" in Calm starts an exercise silent', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => { const s = (window as any).__soulcap.getState(); s.voice.on = true; });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Settle down/ }).click();
    await page.getByRole('button', { name: 'Around people' }).click();
    // Start any listed technique, then the runner's voice should be off.
    await page.locator('#view-calm .card.tap').first().click();
    // detail sheet → Begin
    await page.locator('#sheetPanel').getByRole('button', { name: 'Begin' }).click();
    await expect(page.locator('#runVoice .voice-toggle')).toHaveAttribute('aria-pressed', 'false');
  });

  test('onboarding never asks for a country', async ({ page }) => {
    await page.goto('/');
    await dismissSplash(page);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: '18 or older' }).click();
    await page.getByRole('button', { name: 'Skip', exact: true }).click();
    // Next is the plain-language consent, not a region picker.
    await expect(page.getByText('What this is, plainly.')).toBeVisible();
    await expect(page.getByText('Where are you?')).toHaveCount(0);
  });
});

test.describe('Age gate', () => {
  test('under 18 does not enter the app', async ({ page }) => {
    await toAgeGate(page);
    await page.getByRole('button', { name: /Under 18/ }).click();
    // Stays on onboarding (never enters the app) and points elsewhere for support.
    await expect(page.locator('#view-onboarding')).toBeVisible();
    await expect(page.locator('#tabs')).toBeHidden();
    await expect(page.locator('#view-onboarding')).toContainText(/trusted adult|young people/i);
  });

  test('18+ proceeds into onboarding', async ({ page }) => {
    await toAgeGate(page);
    await page.getByRole('button', { name: '18 or older' }).click();
    await expect(page.getByText('What should we call you?')).toBeVisible();
  });
});

test.describe('Constellation safety', () => {
  test('a person marked hard is never suggested', async ({ page }) => {
    await seedDemo(page);
    // Demo seeds Dad with hard:true.
    const suggested = await page.evaluate(() => {
      const p = (window as any).__soulcap.suggestPerson();
      return p ? p.name : null;
    });
    expect(suggested).not.toBe('Dad');

    // And once everyone else is marked hard, it returns nothing rather than
    // falling back to someone the user flagged.
    const none = await page.evaluate(() => {
      const s = (window as any).__soulcap.getState();
      s.people.forEach((p: any) => { p.hard = true; });
      return (window as any).__soulcap.suggestPerson();
    });
    expect(none).toBeNull();
  });

  test('draining contacts are not suggested', async ({ page }) => {
    await seedDemo(page);
    const name = await page.evaluate(() => {
      const p = (window as any).__soulcap.suggestPerson();
      return p ? p.name : null;
    });
    // Usman is seeded low-support / high-drain.
    expect(name).not.toBe('Usman');
  });
});

test.describe('Data control', () => {
  test('delete removes everything', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click();
    });
    await page.getByRole('button', { name: /Delete everything/ }).click();
    await page.getByRole('button', { name: /Yes, delete it all/ }).click();

    const stored = await page.evaluate(() => localStorage.getItem('soulcap_v1'));
    expect(stored).toBeNull();
    // Right back to a fresh install — welcome screen, no residual session.
    await expect(page.locator('#view-welcome')).toBeVisible();
    await expect(page.locator('#tabs')).toBeHidden();
  });
});
