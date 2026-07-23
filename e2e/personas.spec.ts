import { test, expect, Page } from '@playwright/test';

async function dismissSplash(page: Page) {
  await page.evaluate(() => document.getElementById('splash')?.classList.add('gone'));
  await page.waitForFunction(() => {
    const splash = document.getElementById('splash');
    return !splash || getComputedStyle(splash).visibility === 'hidden';
  });
}

async function seedDemo(page: Page) {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await dismissSplash(page);
}

async function selectTab(page: Page, tab: string) {
  await page.evaluate((value) => {
    (document.querySelector(`#tabs button[data-tab="${value}"]`) as HTMLElement).click();
  }, tab);
}

async function waitForAnimationsIdle(page: Page, selector: string) {
  await page.waitForFunction((sel) => {
    const root = document.querySelector(sel);
    if (!root || typeof (root as any).getAnimations !== 'function') return true;
    const list = (root as Element).getAnimations({ subtree: true });
    return list.every((a) => a.playState === 'finished' || a.playState === 'idle');
  }, selector);
}

test.describe('Synthetic user journeys', () => {
  test('overwhelmed newcomer reaches help before consent and gets discreet Calm options', async ({ page }) => {
    await page.goto('/');
    await dismissSplash(page);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.getByRole('button', { name: 'I need help now' }).click();
    await expect(page.locator('#panic')).toBeVisible();
    await expect(page.locator('#panic')).toContainText('Nothing to get right');
    await page.getByRole('button', { name: /I’m okay/ }).click();

    await page.getByRole('button', { name: '18 or older' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Aisha');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'I understand' }).click();
    await page.getByRole('button', { name: 'Skip', exact: true }).click(); // motion
    await page.getByRole('button', { name: 'Panic' }).click();
    await page.getByRole('button', { name: 'Start' }).click();

    await selectTab(page, 'calm');
    await page.getByRole('button', { name: /Settle down/ }).click();
    await page.getByRole('button', { name: 'Around people' }).click();
    await page.getByRole('button', { name: 'Nothing', exact: true }).click();
    const cards = page.locator('#view-calm .card.tap');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('privacy-conscious journaler creates, finds, and reloads a structured entry', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'SpeechRecognition', { configurable: true, value: undefined });
    });
    await seedDemo(page);
    await selectTab(page, 'journal');
    await page.getByRole('button', { name: /New entry/ }).click();
    await page.getByRole('button', { name: /Night reflection/ }).click();
    await page.locator('#jeBody').fill('A private reflection that stays here.');
    await page.getByRole('button', { name: 'Transcribe with microphone' }).click();
    await expect(page.locator('#jeVoiceStatus')).toContainText('Nothing was sent anywhere');
    await page.locator('#jeSave').click();
    await page.getByRole('searchbox', { name: 'Search your journal' }).fill('private reflection');
    await expect(page.locator('.j-entry')).toHaveCount(1);

    await page.goto('/');
    await dismissSplash(page);
    await selectTab(page, 'journal');
    await page.getByRole('searchbox', { name: 'Search your journal' }).fill('private reflection');
    await expect(page.locator('.j-entry')).toContainText('A private reflection that stays here.');
  });

  test('low-energy returning user gets a fitted skill without engagement penalty', async ({ page }) => {
    await seedDemo(page);
    await page.locator('#view-now .chip').filter({ hasText: 'Heavy' }).click();
    await selectTab(page, 'calm');
    await page.getByRole('button', { name: /Lift a low mood/ }).click();
    await page.getByRole('button', { name: 'On my own' }).click();
    await page.getByRole('button', { name: 'Nothing', exact: true }).click();
    await page.locator('#view-calm .card.tap').first().click();
    await page.locator('#subview').getByRole('button', { name: 'Begin' }).click();
    await expect(page.locator('#runner')).toBeVisible();
    const before = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    await page.getByRole('button', { name: /Stop — no problem/ }).click();
    const after = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    expect(after).toBe(before);
  });

  test('relationship-stressed user can add someone without exposing data', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (!request.url().startsWith('http://localhost:8788')) external.push(request.url());
    });
    await seedDemo(page);
    await selectTab(page, 'map');
    await page.getByRole('button', { name: 'Add someone' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Sam');
    await page.getByRole('combobox', { name: 'Relationship' }).selectOption('PARTNER');
    await page.getByRole('combobox', { name: 'Supportive' }).selectOption('0.5');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    const person = await page.evaluate(() => (window as any).__soulcap.getState().people.find((p: any) => p.name === 'Sam'));
    expect(person).toMatchObject({ name: 'Sam', type: 'PARTNER', supportive: 0.5 });
    expect(external).toEqual([]);
  });

  test('motion-sensitive keyboard user keeps readable controls and instant Help', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await seedDemo(page);
    await selectTab(page, 'journal');
    await page.getByRole('button', { name: /New entry/ }).click();
    await page.getByRole('button', { name: /Blank page/ }).click();
    await expect(page.locator('#journalEditor')).toBeVisible();
    // Editor open animation still runs (opacity) under reduce; measure after idle.
    await waitForAnimationsIdle(page, '#journalEditor');
    const targets = await page.locator('.je-tool, .je-mood button').evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height };
      })
    );
    expect(targets.every((target) => target.width >= 48 && target.height >= 48)).toBe(true);
    const duration = await page.locator('#journalEditor').evaluate((node) =>
      parseFloat(getComputedStyle(node).animationDuration)
    );
    // Reduced-motion: short fade only (≤80–90ms token), not the full travel animation.
    expect(duration).toBeLessThanOrEqual(0.09);
    await page.keyboard.press('Escape');
    await expect(page.locator('#journalEditor')).toBeHidden();

    await page.goto('/?panic=1');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    await expect(page.locator('#panic')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Message someone I trust' })).toBeVisible();
  });
});
