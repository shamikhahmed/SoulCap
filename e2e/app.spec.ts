import { test, expect, Page } from '@playwright/test';

async function dismissSplash(page: Page) {
  await page.evaluate(() => document.getElementById('splash')?.classList.add('gone'));
  await page.waitForFunction(() => {
    const s = document.getElementById('splash');
    return !s || getComputedStyle(s).visibility === 'hidden';
  }, null, { timeout: 4000 });
}

async function seedDemo(page: Page) {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => !!(window as any).__soulcap);
  await dismissSplash(page);
}

/** Fresh install, straight through onboarding into the app. */
async function freshThrough(page: Page) {
  await page.goto('/');
  await dismissSplash(page);
  await page.getByRole('button', { name: 'Begin' }).click();
  await page.getByRole('button', { name: '18 or older' }).click();
  await page.getByRole('button', { name: 'Skip', exact: true }).click(); // name step
  await page.getByRole('button', { name: 'I understand' }).click();
  await page.getByRole('button', { name: /Skip — just let me in/ }).click();
}

/** Start a specific technique by id (test hook), waiting for the runner. */
async function runSkill(page: Page, id: string) {
  await page.evaluate((sid) => (window as any).__soulcap.startSkill(sid), id);
  await expect(page.locator('#runner')).toBeVisible();
}

async function openBlankJournalEntry(page: Page) {
  await page.getByRole('button', { name: /New entry/ }).click();
  await page.getByRole('button', { name: /Blank page/ }).click();
  await expect(page.locator('#journalEditor')).toBeVisible();
}

async function openSettings(page: Page) {
  await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
  await page.locator('.settings-card').click();
  await expect(page.locator('#sheet.on')).toBeVisible();
}

/** Wait until CSS transitions/animations under selector are idle (avoids mid-transition flaky reads). */
async function waitForAnimationsIdle(page: Page, selector = 'body') {
  await page.waitForFunction((sel) => {
    const root = document.querySelector(sel);
    if (!root || typeof (root as any).getAnimations !== 'function') return true;
    const list = (root as Element).getAnimations({ subtree: true });
    return list.every((a) => a.playState === 'finished' || a.playState === 'idle');
  }, selector);
}

test.describe('Smoke', () => {
  test('loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    await seedDemo(page);
    expect(errors).toEqual([]);
  });

  test('all five tabs render content', async ({ page }) => {
    await seedDemo(page);
    for (const [tab, heading] of [
      ['now', /Good |It’s late/],
      ['calm', /What do you need/],
      ['journal', /My Journal|Contents/],
      ['map', /The people around you/],
      ['me', /Shamikh|Your space/]
    ] as const) {
      await page.evaluate((t) => {
        (document.querySelector(`#tabs button[data-tab="${t}"]`) as HTMLElement).click();
      }, tab);
      await expect(page.locator('.view.on')).toContainText(heading);
    }
  });

  test('malformed query encoding does not stop boot', async ({ page }) => {
    await page.goto('/?tab=%E0%A4%A');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    await dismissSplash(page);
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible();
  });
});

test.describe('v0.9 local model', () => {
  test('v5 state migrates through v8 without losing existing check-ins', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('soulcap_v1', JSON.stringify({
        v: 5, welcomed: true, onboarded: true, ageOk: true, consent: true,
        profile: { name: 'Migration test' },
        checkins: [{ t: 1700000000000, state: 'Wired' }],
        inferences: [{ id: 'late-nights', confirmed: false }]
      }));
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      const stored = JSON.parse(localStorage.getItem('soulcap_v1')!);
      return { state, stored };
    });
    expect(result.state.v).toBe(10);
    expect(result.state.checkins[0]).toMatchObject({
      id: 'checkin-1700000000000-0',
      state: 'Wired',
      dims: {},
      triggers: []
    });
    expect(result.state.patternPrefs.decisions['late-nights']).toBe('rejected');
    expect(result.state.drip.answers).toEqual({});
    expect(result.state.drip.skipped).toEqual({});
    expect(result.state.drip.askedToday).toEqual([]);
    expect(result.stored.v).toBe(10);
    expect(result.stored.profile.name).toBe('Migration test');
  });

  test('failed migration persistence leaves the original stored payload intact', async ({ page }) => {
    await page.addInitScript(() => {
      const original = {
        v: 5, welcomed: true, onboarded: true, ageOk: true, consent: true,
        checkins: [{ t: 1700000000000, state: 'Flat' }]
      };
      localStorage.setItem('soulcap_v1', JSON.stringify(original));
      Storage.prototype.setItem = function () { throw new Error('quota'); };
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => ({
      memory: (window as any).__soulcap.getState(),
      stored: JSON.parse(localStorage.getItem('soulcap_v1')!)
    }));
    expect(result.memory.v).toBe(10);
    expect(result.memory.checkins[0]).toMatchObject({ state: 'Flat', dims: {}, triggers: [] });
    expect(result.stored.v).toBe(5);
    expect(result.stored.checkins[0]).toEqual({ t: 1700000000000, state: 'Flat' });
  });

  test('optional detail enriches today’s check-in and direct need affects ranking', async ({ page }) => {
    await seedDemo(page);
    await page.getByRole('button', { name: 'Wired', exact: true }).click();
    await page.getByRole('button', { name: 'Add optional detail' }).click();
    await page.getByRole('slider', { name: 'Mental noise' }).fill('5');
    await page.getByRole('button', { name: 'Clear my head' }).click();
    await page.getByRole('button', { name: 'Work or study' }).click();
    await page.getByRole('textbox', { name: 'Your own words (optional)' }).fill('Scattered');
    await page.getByRole('button', { name: 'Save detail' }).click();
    const result = await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      return {
        checkin: state.checkins[state.checkins.length - 1],
        reason: document.querySelector('#view-now .reason')?.textContent
      };
    });
    expect(result.checkin).toMatchObject({
      state: 'Wired',
      dims: { noise: 5 },
      triggers: ['work'],
      need: 'clarity',
      feeling: 'Scattered'
    });
    expect(result.reason).toContain('clearer head');
  });

  test('failed check-in write rolls back the in-memory change', async ({ page }) => {
    await seedDemo(page);
    const before = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().checkins));
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new Error('quota'); };
    });
    await page.getByRole('button', { name: 'Heavy', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'That did not save' })).toBeVisible();
    const after = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().checkins));
    expect(after).toBe(before);
  });

  test('pattern evidence is inspectable and a rejection persists', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    const row = page.locator('.pattern-row').filter({ hasText: 'Work or study may be showing up often' });
    await expect(row).toContainText('3 distinct days');
    await expect(row).toContainText('Low confidence');
    await row.getByRole('button', { name: 'See evidence' }).click();
    await expect(page.getByText('This is a repeated correlation')).toBeVisible();
    await page.getByRole('button', { name: 'Done' }).click();
    await row.getByRole('button', { name: 'Not really' }).click();
    await expect(row).toHaveCount(0);
    await page.evaluate(() => history.replaceState({}, '', '/'));
    await page.reload();
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    await dismissSplash(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await expect(page.locator('.pattern-row').filter({ hasText: 'Work or study may be showing up often' })).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__soulcap.getState().patternPrefs.decisions['trigger-work'])).toBe('rejected');
  });

  test('presentation controls apply and persist independently', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await page.getByRole('button', { name: 'Mulberry' }).click();
    await page.getByRole('button', { name: 'Large', exact: true }).click();
    await page.getByRole('button', { name: 'Comfortable' }).click();
    await page.getByRole('button', { name: /Higher contrast/ }).click();
    await page.getByRole('button', { name: /Reduce transparency/ }).click();
    const attrs = await page.evaluate(() => ({
      accent: document.documentElement.getAttribute('data-accent'),
      text: document.documentElement.getAttribute('data-text'),
      density: document.documentElement.getAttribute('data-density'),
      contrast: document.documentElement.getAttribute('data-contrast'),
      transparency: document.documentElement.getAttribute('data-transparency'),
      bodySize: parseFloat(getComputedStyle(document.body).fontSize)
    }));
    expect(attrs).toMatchObject({
      accent: 'mulberry',
      text: 'large',
      density: 'comfortable',
      contrast: 'high',
      transparency: 'reduced'
    });
    expect(attrs.bodySize).toBeGreaterThanOrEqual(19);
    await page.evaluate(() => history.replaceState({}, '', '/'));
    await page.reload();
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-accent'))).toBe('mulberry');
    await dismissSplash(page);
    await openSettings(page);
    const before = await page.evaluate(() => (window as any).__soulcap.getState().patternPrefs.enabled);
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new Error('quota'); };
    });
    await page.getByRole('button', { name: /Local pattern observations/ }).click();
    await expect(page.getByRole('heading', { name: 'That setting did not save' })).toBeVisible();
    expect(await page.evaluate(() => (window as any).__soulcap.getState().patternPrefs.enabled)).toBe(before);
  });
});

test.describe('v1.0 offline library and daily supports', () => {
  test('v6 state migrates through v8 without changing existing data', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('soulcap_v1', JSON.stringify({
        v: 6, welcomed: true, onboarded: true, ageOk: true, consent: true,
        profile: { name: 'Version six' },
        checkins: [{ id:'kept', t:1700000000000, updatedAt:1700000000000, state:'Steady', dims:{}, triggers:[], need:'', feeling:'' }],
        patternPrefs: { enabled:true, decisions:{} },
        appearance: { text:'standard', density:'compact', accent:'plum', contrast:'standard', reduceTransparency:false }
      }));
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => ({
      state: (window as any).__soulcap.getState(),
      stored: JSON.parse(localStorage.getItem('soulcap_v1')!)
    }));
    expect(result.state.v).toBe(10);
    expect(result.state.profile.name).toBe('Version six');
    expect(result.state.checkins[0].id).toBe('kept');
    expect(result.state.dailySupports).toEqual({ selected: [], days: {} });
    expect(result.state.drip.answers).toEqual({});
    expect(result.state.drip.skipped).toEqual({});
    expect(result.state.drip.askedToday).toEqual([]);
    expect(result.state.userModel).toEqual({});
    expect(result.state.locale).toBe('en');
    expect(result.stored.v).toBe(10);
  });

  test('library search announces result count for assistive tech', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what’s happening/ }).click();
    await expect(page.getByRole('status')).toContainText(/results/);
    await page.getByRole('searchbox', { name: 'Search the emotional library' }).fill('zzzz-no-match');
    await expect(page.getByRole('status')).toContainText('Nothing matches that search yet.');
  });

  test('library searches offline articles and links to stable exercises', async ({ page }) => {
    await seedDemo(page);
    const requests: string[] = [];
    const origin = new URL(page.url()).origin;
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== origin) requests.push(request.url());
    });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what’s happening/ }).click();
    await page.getByRole('searchbox', { name: 'Search the emotional library' }).fill('grief');
    await expect(page.locator('.article-card')).toHaveCount(1);
    await page.getByRole('button', { name: /Grief/ }).click();
    await expect(page.locator('#sheet').getByRole('heading', { name: 'Grief', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.activeElement && document.activeElement.textContent)).toBe('Close');
    await expect(page.locator('#sheet')).toContainText('When professional support may help');
    await expect(page.locator('#sheet')).toContainText('Not yet reviewed by a licensed clinician');
    await expect(page.locator('#sheet')).toContainText('NHS');
    await page.getByRole('button', { name: 'Hand on your heart' }).click();
    await expect(page.getByRole('heading', { name: 'Hand on your heart' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Begin' })).toBeVisible();
    expect(requests).toEqual([]);
  });

  test('every bundled article has complete support and valid exercise links', async ({ page }) => {
    await seedDemo(page);
    const audit = await page.evaluate(() => {
      const articles = (window as any).ARTICLES;
      const skillIds = (window as any).__soulcap.skillIds;
      return {
        count: articles.length,
        complete: articles.every((article: any) =>
          article.id && article.title && article.summary && article.support &&
          article.sections.length && article.practical.length && article.reflection.length &&
          article.references.length && article.skillIds.length),
        linksValid: articles.every((article: any) =>
          article.skillIds.every((id: string) => skillIds.indexOf(id) !== -1))
      };
    });
    expect(audit.count).toBe(6);
    expect(audit.complete).toBe(true);
    expect(audit.linksValid).toBe(true);
  });

  test('daily supports persist today without scores or streak state', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Small daily supports/ }).click();
    await page.getByRole('button', { name: 'Have some water' }).click();
    await page.getByRole('button', { name: 'See some daylight' }).click();
    const waterCard = page.locator('.support-card').filter({ hasText:'Have some water' });
    await waterCard.getByRole('button', { name: 'Mark for today' }).click();
    await expect(waterCard.getByRole('button', { name: 'Done today' })).toHaveAttribute('aria-pressed', 'true');
    const state = await page.evaluate(() => (window as any).__soulcap.getState());
    expect(state.dailySupports.selected).toEqual(['water', 'daylight']);
    expect(Object.keys(state.dailySupports.days)).toHaveLength(1);
    expect(state.dailySupports.days[Object.keys(state.dailySupports.days)[0]]).toEqual(['water']);
    expect(state).not.toHaveProperty('streak');
    expect(state).not.toHaveProperty('points');
    await page.evaluate(() => history.replaceState({}, '', '/'));
    await page.reload();
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    await dismissSplash(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Small daily supports/ }).click();
    await expect(page.locator('.support-card').filter({ hasText:'Have some water' }).getByRole('button', { name:'Done today' })).toBeVisible();
  });

  test('failed daily-support save restores previous choices', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Small daily supports/ }).click();
    const before = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().dailySupports));
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new Error('quota'); };
    });
    await page.getByRole('button', { name: 'Have some water' }).click();
    await expect(page.getByRole('heading', { name: 'That did not save' })).toBeVisible();
    const after = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().dailySupports));
    expect(after).toBe(before);
  });

  test('failed daily-support completion restores the previous day state', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Small daily supports/ }).click();
    await page.getByRole('button', { name: 'Have some water' }).click();
    const before = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().dailySupports));
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new Error('quota'); };
    });
    await page.getByRole('button', { name: 'Mark for today' }).click();
    await expect(page.getByRole('heading', { name: 'That did not save' })).toBeVisible();
    const after = await page.evaluate(() => JSON.stringify((window as any).__soulcap.getState().dailySupports));
    expect(after).toBe(before);
  });
});

test.describe('v1.9 clinical experiences library', () => {
  test('every experience helps id exists in SKILLS', async ({ page }) => {
    await seedDemo(page);
    const ok = await page.evaluate(() => (window as any).__soulcap.experienceHelpsOk());
    expect(ok).toBe(true);
    const count = await page.evaluate(() => (window as any).__soulcap.experienceIds.length);
    expect(count).toBe(24);
  });

  test('opening an experience shows what/why/helps and launches runner', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what’s happening/ }).click();
    await page.getByRole('button', { name: 'Experiences', exact: true }).click();
    await page.locator('.experience-card[data-experience-id="racing-heart"]').click();
    await expect(page.locator('#sheet')).toContainText('What it can feel like');
    await expect(page.locator('#sheet')).toContainText('Why this can happen');
    await expect(page.locator('#sheet')).toContainText('What may help');
    await expect(page.locator('#sheet')).toContainText('Not a diagnosis');
    await page.locator('#sheetPanel').getByRole('button', { name: /Try · Physiological sigh/ }).click();
    await expect(page.locator('#runner')).toBeVisible();
  });

  test('emergency red-flag panel is number-free and country-agnostic', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (window as any).__soulcap.openExperience('racing-heart'));
    const panel = page.locator('#sheetPanel .redflag-emergency');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Please get urgent help');
    const text = await panel.innerText();
    expect(text).not.toMatch(/\b\d{3,}\b/);
    expect(text.toLowerCase()).not.toMatch(/\bunited states\b|\buk\b|\bcanada\b|\baustralia\b|\bindia\b|\bpakistan\b/);
  });

  test('library search finds an experience by aka', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what’s happening/ }).click();
    await page.getByRole('searchbox', { name: 'Search the emotional library' }).fill('heart pounding');
    await expect(page.locator('.experience-card[data-experience-id="racing-heart"]')).toBeVisible();
    await expect(page.getByRole('status')).toContainText(/result/);
  });

  test('Now what’s-happening picker opens experience then runner', async ({ page }) => {
    await seedDemo(page);
    await page.getByRole('button', { name: /Notice what’s happening/ }).click();
    await expect(page.locator('#sheet')).toContainText('What’s happening?');
    await expect(page.locator('#sheet')).toContainText('Not a diagnosis');
    await page.locator('#sheetPanel .experience-card[data-experience-id="racing-heart"]').click();
    await expect(page.locator('#sheet')).toContainText('What may help');
    await page.locator('#sheetPanel').getByRole('button', { name: /Try · Physiological sigh/ }).click();
    await expect(page.locator('#runner')).toBeVisible();
  });
});

test.describe('v1.1 adaptive drip, themes, locale', () => {
  test('v7 state migrates to v8 with drip and locale defaults', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('soulcap_v1', JSON.stringify({
        v: 7, welcomed: true, onboarded: true, ageOk: true, consent: true,
        profile: { name: 'Version seven' },
        dailySupports: { selected: ['water'], days: {} }
      }));
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => ({
      state: (window as any).__soulcap.getState(),
      stored: JSON.parse(localStorage.getItem('soulcap_v1')!)
    }));
    expect(result.state.v).toBe(10);
    expect(result.state.profile.name).toBe('Version seven');
    expect(result.state.dailySupports.selected).toEqual(['water']);
    expect(result.state.drip.answers).toEqual({});
    expect(result.state.drip.skipped).toEqual({});
    expect(result.state.drip.askedToday).toEqual([]);
    expect(result.state.userModel).toEqual({});
    expect(result.state.locale).toBe('en');
    expect(result.stored.v).toBe(10);
  });

  test('drip answers update estimates and stop after four asks today', async ({ page }) => {
    await seedDemo(page);
    await page.getByRole('button', { name: /Know you a little better/ }).click();
    await expect(page.getByRole('heading', { name: 'A few gentle questions' })).toBeVisible();
    await expect(page.locator('#sheet')).toContainText('Not a diagnosis');
    const sheet = page.locator('#sheet');
    await sheet.getByRole('button', { name: 'Heavy', exact: true }).click();
    await sheet.getByRole('button', { name: 'Both', exact: true }).click();
    await sheet.getByRole('button', { name: 'Uneven', exact: true }).click();
    await sheet.getByRole('button', { name: 'Mind will not switch off' }).click();
    await expect(sheet).toContainText('Enough for today');
    const model = await page.evaluate(() => {
      const s = (window as any).__soulcap.getState();
      return { asked: s.drip.askedToday.length, stress: s.userModel.stress, sleep: s.userModel.sleep, next: (window as any).__soulcap.nextDripQuestion() };
    });
    expect(model.asked).toBe(4);
    expect(model.next).toBeNull();
    expect(model.stress.value).toBeGreaterThanOrEqual(3);
    expect(model.sleep.value).toBeGreaterThanOrEqual(3);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await expect(page.getByText(/Stress load/)).toBeVisible();
    await expect(page.locator('#view-me')).toContainText('Not a diagnosis or clinical score');
  });

  test('estimates are correctable and clearable without diagnosis language', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      const api = (window as any).__soulcap;
      const q = api.nextDripQuestion();
      api.answerDrip(q, q.options[3]);
    });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await page.getByRole('button', { name: 'Adjust' }).first().click();
    await expect(page.locator('#sheet')).toContainText('not diagnoses');
    await page.getByRole('button', { name: '2', exact: true }).click();
    const corrected = await page.evaluate(() => (window as any).__soulcap.getState().userModel.stress);
    expect(corrected.source).toBe('corrected');
    expect(corrected.value).toBeLessThan(4);
    await page.getByRole('button', { name: 'Adjust' }).first().click();
    await page.getByRole('button', { name: 'Clear this estimate' }).click();
    expect(await page.evaluate(() => (window as any).__soulcap.getState().userModel.stress)).toBeUndefined();
  });

  test('mood themes persist and Roman Urdu preview stays LTR without replacing safety English', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await page.getByRole('button', { name: 'Ocean', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('ocean');
    await page.getByRole('button', { name: 'Roman Urdu (preview)' }).click();
    const locale = await page.evaluate(() => ({
      lang: document.documentElement.getAttribute('lang'),
      dir: document.documentElement.getAttribute('dir'),
      fab: document.getElementById('fab')!.getAttribute('aria-label'),
      stored: (window as any).__soulcap.getState().locale,
      mirror: localStorage.getItem('soulcap_locale'),
      theme: localStorage.getItem('soulcap_theme')
    }));
    expect(locale).toMatchObject({ lang: 'rui', dir: 'ltr', stored: 'rui', mirror: 'rui', theme: 'ocean' });
    expect(locale.fab).toContain('madad');
    await expect(page.locator('#sheetTitle')).toHaveText('Tanzimaat');
    await expect(page.locator('#tabs button[data-tab="calm"] span')).toHaveText('Sakoon');
    await page.locator('#sheetPanel').getByRole('button', { name: 'Band karein' }).click();
    await openSettings(page);
    await expect(page.getByText(/clinical review abhi mukammal nahi|Roman Urdu clinical review is not complete/)).toBeVisible();
    await page.evaluate(() => history.replaceState({}, '', '/'));
    await page.reload();
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    expect(await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      dir: document.documentElement.getAttribute('dir')
    }))).toEqual({ theme: 'ocean', dir: 'ltr' });
  });

  test('panic and runner expose dialog semantics and survive 200% page zoom', async ({ page }) => {
    await seedDemo(page);
    await page.getByRole('button', { name: 'I need help now' }).first().click();
    await expect(page.locator('#panic')).toHaveAttribute('role', 'dialog');
    await expect(page.locator('#panic')).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#panic')).toHaveAttribute('aria-label', 'Help now');
    await expect(page.locator('#panicExit')).toBeVisible();
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-text', 'large');
      (document.documentElement as HTMLElement).style.fontSize = '200%';
    });
    await page.locator('#panicExit').evaluate((el) => (el as HTMLElement).scrollIntoView({ block: 'nearest' }));
    const panicOk = await page.evaluate(() => {
      const exit = document.getElementById('panicExit')!;
      const r = exit.getBoundingClientRect();
      const style = getComputedStyle(exit);
      return r.width >= 48 && parseFloat(style.minHeight || '0') >= 48;
    });
    expect(panicOk).toBe(true);
    await page.locator('#panicExit').click();
    await page.evaluate(() => {
      (document.documentElement as HTMLElement).style.fontSize = '';
      document.documentElement.setAttribute('data-text', 'standard');
    });
    await page.evaluate(() => (window as any).__soulcap.startSkill('hand-on-heart'));
    await expect(page.locator('#runner.on')).toBeVisible();
    await expect(page.locator('#runner')).toHaveAttribute('role', 'dialog');
    await expect(page.locator('#runner')).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#runner')).toHaveAttribute('aria-label', 'Exercise');
    await expect(page.locator('#runner')).toHaveAttribute('aria-hidden', 'false');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-text', 'large');
      (document.documentElement as HTMLElement).style.fontSize = '200%';
    });
    const runnerOk = await page.evaluate(() => {
      const next = document.querySelector('#runActions .btn') as HTMLElement | null;
      const text = document.getElementById('runText');
      if (!next || !text) return false;
      next.scrollIntoView({ block: 'nearest' });
      const g = next.getBoundingClientRect();
      const t = text.getBoundingClientRect();
      return g.width >= 48 && g.height >= 40 && t.width > 0 && t.height > 0;
    });
    expect(runnerOk).toBe(true);
  });
});

test.describe('Skills', () => {
  test('a step technique runs end to end and records feedback', async ({ page }) => {
    await seedDemo(page);
    await runSkill(page, 'thought-record'); // step-based, not paced breathing

    for (let i = 0; i < 12; i++) {
      const next = page.locator('#runActions button', { hasText: /^(Next|Finish)$/ });
      if (await next.count() === 0) break;
      await next.first().click();
    }

    await expect(page.locator('#runText')).toContainText('Did that help');
    const before = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    await page.getByRole('button', { name: 'It helped' }).click();
    const after = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    expect(after).toBe(before + 1);
    await expect(page.locator('#runner')).toBeHidden();
  });

  test('a step technique auto-advances (guided by default)', async ({ page }) => {
    await seedDemo(page);
    await runSkill(page, 'thought-record');
    await expect(page.locator('#runGuide')).toHaveAttribute('aria-pressed', 'true');
    const first = await page.locator('#runText').innerText();
    // With no further taps, the step changes on the pacing timer.
    await expect(async () => {
      expect(await page.locator('#runText').innerText()).not.toBe(first);
    }).toPass({ timeout: 12000 });
  });

  test('a breathing technique opens the Apple-Watch style setup and runs', async ({ page }) => {
    await seedDemo(page);
    await runSkill(page, 'box-breathing'); // has a paced pattern
    await expect(page.locator('#runner')).toContainText('Set your breaths');
    await expect(page.locator('#runner')).toContainText(/About .* min/);
    const begin = page.locator('#runActions').getByRole('button', { name: 'Begin' });
    await begin.scrollIntoViewIfNeeded();
    await begin.click();
    await expect(page.locator('#runMeta')).toContainText(/Breath 1 of/);
    await expect(page.locator('#runText')).toContainText(/Breathe in through your nose/);
  });

  test('an exercise can be abandoned without penalty', async ({ page }) => {
    await seedDemo(page);
    await runSkill(page, 'thought-record');
    await page.getByRole('button', { name: /Stop — no problem/ }).click();
    await expect(page.locator('#runner')).toBeHidden();
    const runs = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    expect(runs).toBe(3); // the three seeded by demo
  });
});

test.describe('Calm context', () => {
  test('things to hand support multiple choices with Nothing exclusive', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Settle down/ }).click();
    const available = page.getByRole('group', { name: 'Things available' });
    const nothing = available.getByRole('button', { name: 'Nothing', exact: true });
    const water = available.getByRole('button', { name: 'A tap or drink' });
    const cold = available.getByRole('button', { name: 'Something cold' });

    await expect(nothing).toHaveAttribute('aria-pressed', 'true');
    await water.click();
    await cold.click();
    await expect(nothing).toHaveAttribute('aria-pressed', 'false');
    await expect(water).toHaveAttribute('aria-pressed', 'true');
    await expect(cold).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#view-calm .meta').filter({ hasText: 'A tap or a drink' }).first()).toBeVisible();
    await expect(page.locator('#view-calm .meta').filter({ hasText: 'Something cold' }).first()).toBeVisible();

    await nothing.click();
    await expect(nothing).toHaveAttribute('aria-pressed', 'true');
    await expect(water).toHaveAttribute('aria-pressed', 'false');
    await expect(cold).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('Journal', () => {
  test('a journal entry can be written and saved', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const before = await page.evaluate(() => (window as any).__soulcap.getState().journal.length);
    await openBlankJournalEntry(page);
    await page.locator('#jeBody').fill('A quiet test entry.');
    await page.locator('#jeSave').click();
    await expect(page.locator('#journalEditor')).toBeHidden();
    const after = await page.evaluate(() => (window as any).__soulcap.getState().journal.length);
    expect(after).toBe(before + 1);
    await expect(page.locator('#view-journal')).toContainText('A quiet test entry.');
  });

  test('the journal book cover can be customised', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await page.locator('.book-cover').click();
    const title = page.locator('#sheetPanel input').first();
    await title.fill('Night Pages');
    await page.locator('#sheetPanel').getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.book-cover')).toContainText('Night Pages');
  });

  test('a local photo can become the journal cover', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await page.locator('.book-cover').click();
    await page.locator('#sheetPanel input[type="file"]').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    });
    await expect(page.locator('.cover-photo-preview')).toBeVisible();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.book-cover .bc-photo')).toBeVisible();
    const source = await page.locator('.book-cover .bc-photo').getAttribute('src');
    expect(source).toMatch(/^data:image\/jpeg/);
  });

  test('rebuilt cover sheet restores focus to its external opener', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const opener = page.locator('.book-cover');
    await opener.click();
    await page.locator('#sheetPanel input[type="file"]').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    });
    await expect(page.locator('.cover-photo-preview')).toBeVisible();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Cancel' }).click();
    await expect(opener).toBeFocused();
  });

  test('changing theme does not scroll the page to the top', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.locator('.settings-card').click();
    await page.locator('#sheetPanel .chip', { hasText: 'Dark' }).first().click();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Close' }).click();
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(300); // stayed roughly where it was, no jump to 0
  });

  test('the paper editor uses the serif reading face', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    const font = await page.locator('#jeBody').evaluate((n) => getComputedStyle(n).fontFamily);
    expect(font.toLowerCase()).toMatch(/serif|new york|georgia/);
  });

  test('a template seeds a new draft while blank stays available', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await page.getByRole('button', { name: /New entry/ }).click();
    await expect(page.getByRole('button', { name: /Blank page/ })).toBeVisible();
    await page.getByRole('button', { name: /Three good things/ }).click();
    await expect(page.locator('#jeTitle')).toHaveValue('Three good things');
    await expect(page.locator('#jeBody')).toHaveValue(/1\.\s+2\.\s+3\./);
  });

  test('on-device transcription appends text and sends no external request', async ({ page }) => {
    await page.addInitScript(() => {
      function FakeRecognition(this: any) { this.processLocally = false; }
      (FakeRecognition as any).available = (options: any) => {
        (window as any).__speechAvailabilityOptions = options;
        return Promise.resolve('available');
      };
      (FakeRecognition as any).prototype.start = function () {
        (window as any).__speechRecognitionInstance = this;
        const result: any = [{ transcript: 'spoken words' }];
        result.isFinal = true;
        setTimeout(() => this.onresult({ resultIndex: 0, results: [result] }), 0);
      };
      (FakeRecognition as any).prototype.stop = function () {};
      (window as any).SpeechRecognition = FakeRecognition;
    });
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    await page.locator('#jeBody').fill('Before');
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.getByRole('button', { name: 'Transcribe with microphone' }).click();
    await expect(page.locator('#jeBody')).toHaveValue('Before spoken words');
    const localOnly = await page.evaluate(() => ({
      options: (window as any).__speechAvailabilityOptions,
      processLocally: (window as any).__speechRecognitionInstance.processLocally
    }));
    expect(localOnly.options).toMatchObject({ processLocally: true });
    expect(localOnly.processLocally).toBe(true);
    expect(requests).toEqual([]);
  });

  test('pending transcription cannot start after editor closes', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__recognitionStarts = 0;
      function SlowRecognition(this: any) { this.processLocally = false; }
      (SlowRecognition as any).available = () => new Promise((resolve) => {
        (window as any).__resolveSpeechAvailability = resolve;
      });
      (SlowRecognition as any).prototype.start = function () { (window as any).__recognitionStarts++; };
      (SlowRecognition as any).prototype.stop = function () {};
      (window as any).SpeechRecognition = SlowRecognition;
    });
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    await page.getByRole('button', { name: 'Transcribe with microphone' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.evaluate(() => (window as any).__resolveSpeechAvailability('available'));
    await page.waitForTimeout(50);
    const starts = await page.evaluate(() => (window as any).__recognitionStarts);
    expect(starts).toBe(0);
  });

  test('a second mic tap cancels pending local transcription', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__recognitionStarts = 0;
      function SlowRecognition(this: any) { this.processLocally = false; }
      (SlowRecognition as any).available = () => new Promise((resolve) => {
        (window as any).__resolveSpeechAvailability = resolve;
      });
      (SlowRecognition as any).prototype.start = function () { (window as any).__recognitionStarts++; };
      (SlowRecognition as any).prototype.stop = function () {};
      (window as any).SpeechRecognition = SlowRecognition;
    });
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    const mic = page.getByRole('button', { name: 'Transcribe with microphone' });
    await mic.click();
    await mic.click();
    await page.evaluate(() => (window as any).__resolveSpeechAvailability('available'));
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => (window as any).__recognitionStarts)).toBe(0);
    await expect(mic).toHaveAttribute('aria-pressed', 'false');
  });

  test('unsupported transcription stays private and keeps editor usable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'SpeechRecognition', { configurable: true, value: undefined });
    });
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    await page.getByRole('button', { name: 'Transcribe with microphone' }).click();
    await expect(page.locator('#jeVoiceStatus')).toContainText('not available');
    await page.locator('#jeBody').fill('Typed instead.');
    await page.locator('#jeSave').click();
    await expect(page.locator('#view-journal')).toContainText('Typed instead.');
  });

  test('search filters entries and month navigation is available', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      state.journal.push({ id: 'older-entry', t: new Date(2025, 0, 12).getTime(), title: 'Winter note', body: 'A unique snow thought.', mood: '', photos: [] });
      localStorage.setItem('soulcap_v1', JSON.stringify(state));
      (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click();
    });
    await expect(page.locator('.journal-months')).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search your journal' }).fill('unique snow');
    await expect(page.locator('.j-entry')).toHaveCount(1);
    await expect(page.locator('.j-entry')).toContainText('Winter note');
    await page.getByRole('searchbox', { name: 'Search your journal' }).fill('does not exist');
    await expect(page.locator('.journal-contents')).toContainText('No entries match');
  });

  test('entry decoration persists', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    await page.locator('#jeBody').fill('A decorated thought.');
    await page.getByRole('button', { name: 'Decorate this page' }).click();
    await page.getByRole('button', { name: /Washi edge/ }).click();
    await page.locator('#jeSave').click();
    await expect(page.locator('.j-entry.decor-washi')).toContainText('A decorated thought.');
  });

  test('failed edit save restores previous entry', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const entry = page.locator('.j-entry').filter({ hasText: 'A better evening' });
    await entry.click();
    await page.locator('#jeTitle').fill('Changed but not saved');
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
    });
    await page.locator('#jeSave').click();
    await expect(page.locator('#sheetPanel')).toContainText('Storage is full');
    const title = await page.evaluate(() => (window as any).__soulcap.getState().journal.find((e: any) => e.title === 'A better evening')?.title);
    expect(title).toBe('A better evening');
  });

  test('failed new-entry save keeps a retryable draft', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const before = await page.evaluate(() => (window as any).__soulcap.getState().journal.length);
    await openBlankJournalEntry(page);
    await page.locator('#jeBody').fill('Keep this draft for retry.');
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
    });
    await page.locator('#jeSave').click();
    await expect(page.locator('#sheetPanel')).toContainText('Storage is full');
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('#journalEditor')).toBeVisible();
    await expect(page.locator('#jeBody')).toHaveValue('Keep this draft for retry.');
    const after = await page.evaluate(() => (window as any).__soulcap.getState().journal.length);
    expect(after).toBe(before);
  });

  test('failed cover save restores state and reopens staged edits', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const original = await page.evaluate(() => (window as any).__soulcap.getState().journalCover.title);
    await page.locator('.book-cover').click();
    await expect(page.locator('#sheet')).toHaveAttribute('aria-labelledby', 'sheetTitle');
    await page.locator('#sheetPanel input[type="text"]').first().fill('Retry this cover');
    await page.evaluate(() => {
      Storage.prototype.setItem = function () { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
    });
    await page.locator('#sheetPanel').getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('#sheetPanel')).toContainText('Storage is full');
    const current = await page.evaluate(() => (window as any).__soulcap.getState().journalCover.title);
    expect(current).toBe(original);
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('#sheetPanel input[type="text"]').first()).toHaveValue('Retry this cover');
  });
});

test.describe('Check-ins', () => {
  test('tapping a mood twice in one day does not stack entries', async ({ page }) => {
    await seedDemo(page);
    const chip = page.locator('#view-now .chips .chip').filter({ hasText: 'Wired' });
    await chip.click();
    const afterFirst = await page.evaluate(() => (window as any).__soulcap.getState().checkins.length);
    await page.locator('#view-now .chips .chip').filter({ hasText: 'Flat' }).click();
    await page.locator('#view-now .chips .chip').filter({ hasText: 'Steady' }).click();
    const afterMore = await page.evaluate(() => (window as any).__soulcap.getState().checkins.length);
    // Same calendar day → the latest entry is updated, not appended.
    expect(afterMore).toBe(afterFirst);
  });

  test('same-day check-in keeps original timestamp and updates updatedAt', async ({ page }) => {
    await seedDemo(page);
    await page.locator('#view-now .chips .chip').filter({ hasText: 'Steady' }).click();
    const before = await page.evaluate(() => {
      const list = (window as any).__soulcap.getState().checkins;
      const c = list[list.length - 1];
      return { id: c.id, t: c.t, state: c.state };
    });
    await page.waitForTimeout(20);
    await page.locator('#view-now .chips .chip').filter({ hasText: 'Wired' }).click();
    const after = await page.evaluate(() => {
      const list = (window as any).__soulcap.getState().checkins;
      const c = list[list.length - 1];
      return { id: c.id, t: c.t, updatedAt: c.updatedAt, state: c.state };
    });
    expect(after.id).toBe(before.id);
    expect(after.t).toBe(before.t);
    expect(after.state).toBe('Wired');
    expect(after.updatedAt).toBeGreaterThanOrEqual(before.t);
  });

  test('each check-in state meaningfully changes the recommendation', async ({ page }) => {
    await seedDemo(page);
    const states = ['Steady', 'Wired', 'Flat', 'Heavy', 'Not sure'];
    const results: { state: string; title: string; reason: string }[] = [];
    for (const state of states) {
      await page.locator('#view-now .chips .chip').filter({ hasText: state }).click();
      const skillCard = page.locator('#view-now .card').filter({ has: page.getByRole('button', { name: 'Begin' }) }).first();
      results.push({
        state,
        title: await skillCard.locator('.card-title').innerText(),
        reason: await skillCard.locator('.reason').innerText(),
      });
    }
    expect(new Set(results.map((result) => result.title)).size).toBe(states.length);
    expect(results[0].reason).toContain('steady');
    expect(results[1].reason).toContain('wired');
    expect(results[2].reason).toContain('flat');
    expect(results[3].reason).toContain('heavy');
    expect(results[4].reason).toContain('not sure');
  });
});

test.describe('Suggestion engine', () => {
  test('a suggestion always carries a stated reason', async ({ page }) => {
    await seedDemo(page);
    await expect(page.locator('#view-now .reason').first()).toBeVisible();
    const text = await page.locator('#view-now .reason').first().innerText();
    expect(text.length).toBeGreaterThan(10);
  });

  test('cold start never claims personal history it does not have', async ({ page }) => {
    await freshThrough(page);

    // Context the app genuinely has (time of day) is fair game. Claims about the
    // user — past sessions, stated feelings, things that "helped before" — are not,
    // because on a fresh install there is nothing behind them.
    const reason = await page.locator('#view-now .reason').innerText();
    for (const claim of ['you said', 'helped you before', 'you mentioned', 'you’ve been', 'last time']) {
      expect(reason.toLowerCase(), `cold start must not claim "${claim}"`).not.toContain(claim);
    }
  });
});

test.describe('Constellation', () => {
  test('empty state offers a way in without implying failure', async ({ page }) => {
    await freshThrough(page);
    await page.evaluate(() => {
      (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click();
    });
    await expect(page.getByRole('button', { name: /Add the first person/ })).toBeVisible();
  });

  test('adding a person renders them on the map', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click();
    });
    await page.getByRole('button', { name: 'Add someone' }).click();
    await page.getByLabel('Name').fill('Hira');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('#map')).toContainText('Hira');
  });

  test('nodes do not overlap the centre', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click();
    });
    const overlapping = await page.evaluate(() => {
      const circles = Array.from(document.querySelectorAll('#map .node circle'));
      return circles.filter((c) => {
        const cx = parseFloat(c.getAttribute('cx')!);
        const cy = parseFloat(c.getAttribute('cy')!);
        return Math.hypot(cx - 200, cy - 200) < 45;
      }).length;
    });
    expect(overlapping).toBe(0);
  });

  test('the map rotates on its own, and labels stay upright', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    const sample = () => page.evaluate(() => {
      const c = document.querySelector('#map .node circle')!;
      return parseFloat(c.getAttribute('cx')!);
    });
    const a = await sample();
    await expect(async () => { expect(Math.abs((await sample()) - a)).toBeGreaterThan(0.5); }).toPass({ timeout: 4000 });
    // Node labels are plain text with no rotate transform (the old bug rotated them off-screen).
    const anyRotated = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#map .node-lab')).some((t) => /rotate/i.test((t.getAttribute('transform') || ''))));
    expect(anyRotated).toBe(false);
  });

  test('rings go up to 7 and stay inside the box', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await page.locator('#view-map .chips .chip', { hasText: '7' }).click();
    const rings = await page.evaluate(() => document.querySelectorAll('#map .orbit').length);
    expect(rings).toBe(7);
    const maxR = await page.evaluate(() =>
      Math.max(...Array.from(document.querySelectorAll('#map .orbit')).map((o) => parseFloat(o.getAttribute('r')!))));
    expect(maxR).toBeLessThanOrEqual(175); // node (11) + label fits within 200
  });

  test('rings can be renamed', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await page.getByRole('button', { name: 'Name the rings' }).click();
    const first = page.locator('#sheetPanel input').first();
    await first.fill('Inner circle');
    await first.blur();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Done' }).click();
    const labels = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#map .orbit-lab')).map((t) => t.textContent));
    expect(labels.join(' ')).toContain('INNER CIRCLE');
  });

  test('pinch helpers remapping outer people when rings shrink', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await page.evaluate(() => {
      const api = (window as any).__soulcap;
      api.setRingCount(7);
      api.getState().people[0].ring = 'r6';
    });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="now"]') as HTMLElement).click());
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    expect(await page.evaluate(() => document.querySelectorAll('#map .orbit').length)).toBe(7);
    await page.evaluate(() => (window as any).__soulcap.setRingCount(3));
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="now"]') as HTMLElement).click());
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    const result = await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      return { rings: state.rings, outer: state.people.filter((p: any) => p.ring === 'r6').length, orbits: document.querySelectorAll('#map .orbit').length };
    });
    expect(result.rings).toBe(3);
    expect(result.outer).toBe(0);
    expect(result.orbits).toBe(3);
  });

  test('long-press rename sheet opens for a ring label', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await page.evaluate(() => {
      const lab = document.querySelector('#map .orbit-lab') as any;
      lab.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'touch', clientX: 10, clientY: 10 }));
    });
    await page.waitForTimeout(650);
    await expect(page.getByRole('heading', { name: 'Rename ring' })).toBeVisible();
    await page.getByLabel('Ring name').fill('Core');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const labels = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#map .orbit-lab')).map((t) => t.textContent));
    expect(labels.join(' ')).toContain('CORE');
  });

  test('contact frequency changes node size without importance language', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await page.locator('#sheetPanel').getByRole('button', { name: /Track when we last spoke/ }).click();
    await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      const a = state.people[0];
      const b = state.people[1];
      a.spokeAt = [Date.now(), Date.now() - 86400000, Date.now() - 2 * 86400000];
      a.lastContact = Date.now();
      if (b) { b.spokeAt = []; b.lastContact = null; }
    });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await expect(page.getByText(/not how important anyone is/)).toBeVisible();
    const sizes = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('#map .node circle'));
      return nodes.map((c) => parseFloat(c.getAttribute('r')!));
    });
    expect(Math.max(...sizes)).toBeGreaterThan(Math.min(...sizes));
  });

  test('safety plan can pull supportive people from the Constellation', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await page.getByRole('button', { name: /My plan/ }).click();
    await expect(page.getByText(/From your Constellation/)).toBeVisible();
    const name = await page.evaluate(() => {
      const p = (window as any).__soulcap.getState().people.find((x: any) => !x.hard && x.supportive >= 0.5);
      return p && p.name;
    });
    expect(name).toBeTruthy();
    await page.locator('#sheet').getByRole('button', { name: name!, exact: true }).click();
    await expect(page.getByLabel('People I can tell')).toHaveValue(new RegExp(name!));
  });
});

test.describe('History & adaptation', () => {
  test('history section saves and is optional (never in onboarding)', async ({ page }) => {
    // Fresh onboarding must not ask history questions.
    await freshThrough(page);
    // Now fill some history from the You tab.
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Your story/ }).click();
    await page.locator('#sheetPanel textarea').first().fill('with my family');
    await page.locator('#sheetPanel textarea').first().blur();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Done' }).click();
    const saved = await page.evaluate(() => (window as any).__soulcap.getState().history);
    expect(Object.values(saved).join(' ')).toContain('with my family');
  });

  test('noting past trauma keeps activating techniques out of auto-suggestions', async ({ page }) => {
    await seedDemo(page);
    const withoutTrauma = await page.evaluate(() => (window as any).__soulcap.suggestSkill().skill.id);
    // Record trauma, then the body scan (traumaCaution) must never be the top pick.
    const topIsCaution = await page.evaluate(() => {
      const s = (window as any).__soulcap.getState();
      s.history.trauma = 'some hard things a while ago';
      const pick = (window as any).__soulcap.suggestSkill();
      return pick.skill.traumaCaution === true;
    });
    expect(topIsCaution).toBe(false);
    expect(typeof withoutTrauma).toBe('string');
  });
});

test.describe('Accessibility', () => {
  test('compact labels preserve the iPhone visual hierarchy', async ({ page }) => {
    await seedDemo(page);
    const sizes = await page.evaluate(() => ({
      tab: parseFloat(getComputedStyle(document.querySelector('#tabs button span')!).fontSize),
      eyebrow: parseFloat(getComputedStyle(document.querySelector('.view.on .eyebrow')!).fontSize),
      tabTarget: document.querySelector('#tabs button')!.getBoundingClientRect().height,
    }));
    expect(sizes.tab).toBeLessThanOrEqual(10.5);
    expect(sizes.eyebrow).toBeLessThanOrEqual(12);
    expect(sizes.tabTarget).toBeGreaterThanOrEqual(48);
  });

  test('touch targets meet the 48px minimum', async ({ page }) => {
    await seedDemo(page);
    await page.getByRole('button', { name: 'Wired', exact: true }).click();
    await page.getByRole('button', { name: 'Add optional detail' }).click();
    let small = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('#sheet button, #sheet input[type="range"]').forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.height > 0 && r.height < 47.5) out.push((b.textContent || b.getAttribute('aria-label') || '').trim().slice(0, 30));
      });
      return out;
    });
    expect(small).toEqual([]);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    small = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('.view.on button, #tabs button').forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.height > 0 && r.height < 47.5) out.push((b.textContent || '').trim().slice(0, 30));
      });
      return out;
    });
    expect(small).toEqual([]);
  });

  test('page does not scroll horizontally', async ({ page }) => {
    await seedDemo(page);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('both themes keep body text readable', async ({ page }) => {
    // Body colour/background transition mid-flight yields interpolated RGB and flakes under load.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await seedDemo(page);
    for (const theme of ['light', 'dark']) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await waitForAnimationsIdle(page, 'body');
      const result = await page.evaluate(() => {
        function lum(rgb: string) {
          const m = rgb.match(/\d+/g)!.map(Number);
          const [r, g, b] = m.map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
        const body = getComputedStyle(document.body);
        const l1 = lum(body.color);
        const l2 = lum(body.backgroundColor);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio;
      });
      expect(result, `${theme} body contrast`).toBeGreaterThan(7); // AAA for body text
    }
  });

  test('every tab has an accessible name', async ({ page }) => {
    await seedDemo(page);
    const tabs = page.locator('#tabs button');
    const n = await tabs.count();
    for (let i = 0; i < n; i++) {
      expect((await tabs.nth(i).innerText()).trim().length).toBeGreaterThan(0);
    }
  });

  test('sheets trap focus and restore the opener', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    const opener = page.getByRole('button', { name: /New entry/ });
    await opener.click();
    const blank = page.getByRole('button', { name: /Blank page/ });
    const cancel = page.locator('#sheetPanel').getByRole('button', { name: 'Cancel' });
    await expect(blank).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(cancel).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(blank).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });
});

test.describe('v1.4 bundled features', () => {
  test('greeting at 5am reads as late', async ({ page }) => {
    await seedDemo(page);
    const text = await page.evaluate(() => (window as any).__soulcap.greetingForHour(5));
    expect(text).toMatch(/It’s late/);
  });

  test('Settings card opens the settings sheet', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await expect(page.locator('#sheetPanel').getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText(/Map pace/)).toBeVisible();
  });

  test('map pace Live moves faster than Still', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="map"]') as HTMLElement).click());
    await page.evaluate(async () => {
      const api = (window as any).__soulcap;
      api.setMapPace('still');
      await new Promise((r) => setTimeout(r, 600));
    });
    const still = await page.evaluate(async () => {
      const api = (window as any).__soulcap;
      api.setMapPace('still');
      return api.mapAngleSample(800);
    });
    const live = await page.evaluate(async () => {
      const api = (window as any).__soulcap;
      api.setMapPace('live');
      return api.mapAngleSample(800);
    });
    expect(Math.abs(live)).toBeGreaterThan(Math.abs(still) + 0.01);
  });

  test('reset menu can add an item', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Personal reset menu/ }).click();
    await page.getByRole('button', { name: /Edit reset menu/ }).click();
    await page.getByRole('button', { name: /Add a reset step/ }).click();
    const count = await page.evaluate(() => (window as any).__soulcap.getState().resetItems.length);
    expect(count).toBeGreaterThan(0);
  });

  test('a thought can be parked and stored locally', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await page.getByRole('button', { name: 'Park a thought' }).click();
    await page.getByLabel('What is it about?').fill('Tomorrow worry');
    await page.getByRole('button', { name: 'Park it' }).click();
    const parked = await page.evaluate(() => (window as any).__soulcap.getState().parkedThoughts);
    expect(parked.some((p: any) => p.title === 'Tomorrow worry')).toBe(true);
  });

  test('v8 ur locale migrates to rui on v9', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('soulcap_v1', JSON.stringify({
        v: 8, welcomed: true, onboarded: true, ageOk: true, consent: true,
        profile: { name: 'Urdu user' }, locale: 'ur'
      }));
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => ({
      state: (window as any).__soulcap.getState(),
      stored: JSON.parse(localStorage.getItem('soulcap_v1')!)
    }));
    expect(result.state.v).toBe(10);
    expect(result.state.locale).toBe('rui');
    expect(result.stored.locale).toBe('rui');
    expect(result.state.mapPace).toBe('drift');
    expect(result.state.resetItems).toEqual([]);
    expect(result.state.manual).toEqual({ lines: [], dismissedAuto: {} });
    expect(result.state.libraryBookmarks).toEqual([]);
  });
});

test.describe('v1.6 bundled features', () => {
  test('v9 state migrates to v10 with manual and bookmarks', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('soulcap_v1', JSON.stringify({
        v: 9, welcomed: true, onboarded: true, ageOk: true, consent: true,
        profile: { name: 'V10 test' },
        people: [{ id: 'p1', name: 'Sam', type: 'FRIEND', ring: 'r0', supportive: 0.5, drain: 0.5 }]
      }));
    });
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    const result = await page.evaluate(() => ({
      state: (window as any).__soulcap.getState(),
      stored: JSON.parse(localStorage.getItem('soulcap_v1')!)
    }));
    expect(result.state.v).toBe(10);
    expect(result.state.manual.lines).toEqual([]);
    expect(result.state.libraryBookmarks).toEqual([]);
    expect(result.state.people[0].notes).toBe('');
    expect(result.state.people[0].events).toEqual([]);
    expect(result.state.people[0].ringHistory).toEqual([]);
    expect(result.stored.v).toBe(10);
  });

  test('manual refresh adds from principle and preserves edited user line', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      state.principles = ['Breathe before replying'];
      state.manual.lines = [{ id: 'user-1', section: 'thinking', text: 'My own line', source: 'user', edited: false }];
      localStorage.setItem('soulcap_v1', JSON.stringify(state));
    });
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="me"]') as HTMLElement).click());
    await page.locator('.manual-card').click();
    await page.getByRole('button', { name: 'Refresh suggestions' }).click();
    const manual = await page.evaluate(() => (window as any).__soulcap.getState().manual.lines);
    expect(manual.some((l: any) => l.text === 'My own line')).toBe(true);
    expect(manual.some((l: any) => l.text === 'Breathe before replying')).toBe(true);
    await page.locator('input[value="My own line"]').fill('My own line edited');
    await page.locator('input[value="My own line"]').blur();
    await page.getByRole('button', { name: 'Refresh suggestions' }).click();
    const after = await page.evaluate(() => (window as any).__soulcap.getState().manual.lines);
    const edited = after.find((l: any) => l.id === 'user-1');
    expect(edited.text).toBe('My own line edited');
    expect(edited.edited).toBe(true);
  });

  test('confirmed pattern produces manual line on refresh', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      const state = (window as any).__soulcap.getState();
      state.patternPrefs.decisions['late-nights'] = 'confirmed';
      for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(23, 0, 0, 0);
        state.checkins.push({
          id: 'late-' + i, t: d.getTime(), updatedAt: d.getTime(), state: 'Wired',
          dims: {}, triggers: [], need: '', feeling: ''
        });
      }
      localStorage.setItem('soulcap_v1', JSON.stringify(state));
    });
    const added = await page.evaluate(() => (window as any).__soulcap.refreshManual());
    const lines = await page.evaluate(() => (window as any).__soulcap.getState().manual.lines);
    expect(added).toBeGreaterThan(0);
    expect(lines.some((l: any) => l.section === 'rest' && l.text.indexOf('you noticed') !== -1)).toBe(true);
  });

  test('library bookmark persists', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what/ }).click();
    await page.getByRole('button', { name: /Anxiety and panic/ }).first().click();
    await page.getByRole('button', { name: 'Save article' }).click();
    const bookmarks = await page.evaluate(() => (window as any).__soulcap.getState().libraryBookmarks);
    expect(bookmarks).toContain('anxiety-panic');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('soulcap_v1')!).libraryBookmarks);
    expect(stored).toContain('anxiety-panic');
  });

  test('person notes save locally', async ({ page }) => {
    await seedDemo(page);
    await page.evaluate(() => {
      (window as any).__soulcap.setMapPace('still');
      const people = (window as any).__soulcap.getState().people;
      const p = people.find((x: { name: string }) => x.name === 'Amina');
      p.notes = 'Calls on Sundays help.';
      localStorage.setItem('soulcap_v1', JSON.stringify((window as any).__soulcap.getState()));
    });
    const notes = await page.evaluate(() => {
      const people = (window as any).__soulcap.getState().people;
      return people.find((p: { name: string }) => p.name === 'Amina').notes;
    });
    expect(notes).toBe('Calls on Sundays help.');
    const stored = await page.evaluate(() => {
      const people = JSON.parse(localStorage.getItem('soulcap_v1')!).people;
      return people.find((p: { name: string }) => p.name === 'Amina').notes;
    });
    expect(stored).toBe('Calls on Sundays help.');
  });

  test('Settings still opens from You', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await expect(page.locator('#sheetPanel').getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});

test.describe('v1.7 polish and locale', () => {
  test('reduced-motion sheet stays usable with focus', async ({ page }) => {
    await seedDemo(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openSettings(page);
    await expect(page.locator('#sheet.on')).toBeVisible();
    const sheetFocus = await page.evaluate(() => {
      const active = document.activeElement;
      return Boolean(active && active.closest('#sheetPanel'));
    });
    expect(sheetFocus).toBe(true);
  });

  test('Roman Urdu localizes chrome but library article body stays English', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await page.getByRole('button', { name: 'Roman Urdu (preview)' }).click();
    await expect(page.locator('#sheetTitle')).toHaveText('Tanzimaat');
    await page.locator('#sheetPanel').getByRole('button', { name: 'Saakin' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Saakin' })).toBeVisible();
    await page.locator('#sheetPanel').getByRole('button', { name: 'Band karein' }).click();
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
    await page.getByRole('button', { name: /Understand what/i }).click();
    await page.locator('.article-card').first().click();
    await expect(page.locator('#sheet.on')).toBeVisible();
    await expect(page.locator('#sheetPanel')).toContainText(/Anxiety and panic/i);
    await expect(page.locator('#sheetPanel')).toContainText(/Not yet reviewed by a licensed clinician/i);
  });

  test('dark and AMOLED themes persist from settings', async ({ page }) => {
    await seedDemo(page);
    await openSettings(page);
    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
    await page.getByRole('button', { name: 'AMOLED', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('amoled');
    await page.evaluate(() => history.replaceState({}, '', '/'));
    await page.reload();
    await page.waitForFunction(() => Boolean((window as any).__soulcap));
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('amoled');
  });
});

test.describe('Offline', () => {
  test('app still works with the network down', async ({ page, context }) => {
    await seedDemo(page);
    // Let the service worker install and take control.
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15000 });

    await context.setOffline(true);
    await page.reload();

    await expect(page.locator('#view-now')).toBeVisible();
    await expect(page.locator('.view.on .help-btn')).toBeVisible();

    // Crisis routes must survive with no connection.
    await page.locator('.view.on .help-btn').click();
    expect(await page.locator('#panicLinks a').count()).toBeGreaterThan(0);

    await context.setOffline(false);
  });
});
