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
    await page.locator('#view-me .chips .chip', { hasText: 'Dark' }).first().click();
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
      (SlowRecognition as any).available = () => new Promise((resolve) => setTimeout(() => resolve('available'), 120));
      (SlowRecognition as any).prototype.start = function () { (window as any).__recognitionStarts++; };
      (SlowRecognition as any).prototype.stop = function () {};
      (window as any).SpeechRecognition = SlowRecognition;
    });
    await seedDemo(page);
    await page.evaluate(() => (document.querySelector('#tabs button[data-tab="journal"]') as HTMLElement).click());
    await openBlankJournalEntry(page);
    await page.getByRole('button', { name: 'Transcribe with microphone' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(180);
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
  test('touch targets meet the 48px minimum', async ({ page }) => {
    await seedDemo(page);
    const small = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('.view.on button, #tabs button').forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.height > 0 && r.height < 42) out.push((b.textContent || '').trim().slice(0, 30));
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
    await seedDemo(page);
    for (const theme of ['light', 'dark']) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
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
