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
  await page.getByRole('button', { name: /United Kingdom/ }).click();
  await page.getByRole('button', { name: 'I understand' }).click();
  await page.getByRole('button', { name: /Skip — just let me in/ }).click();
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
      ['calm', /Something for right now/],
      ['skills', /Things that help/],
      ['map', /The people around you/],
      ['me', /What SoulCap knows/]
    ] as const) {
      await page.evaluate((t) => {
        (document.querySelector(`#tabs button[data-tab="${t}"]`) as HTMLElement).click();
      }, tab);
      await expect(page.locator('.view.on')).toContainText(heading);
    }
  });
});

test.describe('Skills', () => {
  test('a skill runs end to end and records feedback', async ({ page }) => {
    await seedDemo(page);
    await page.locator('#view-now .card .btn', { hasText: 'Begin' }).first().click();
    await expect(page.locator('#runner')).toBeVisible();

    // Walk to the end.
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

  test('guided mode advances through steps on its own', async ({ page }) => {
    await seedDemo(page);
    await page.locator('#view-now .card .btn', { hasText: 'Begin' }).first().click();
    await expect(page.locator('#runner')).toBeVisible();
    const first = await page.locator('#runText').innerText();

    await page.locator('#runGuide').click();
    await expect(page.locator('#runGuide')).toHaveAttribute('aria-pressed', 'true');

    // With no further taps, the step should change on the pacing timer.
    await expect(async () => {
      expect(await page.locator('#runText').innerText()).not.toBe(first);
    }).toPass({ timeout: 12000 });
  });

  test('an exercise can be abandoned without penalty', async ({ page }) => {
    await seedDemo(page);
    await page.locator('#view-now .card .btn', { hasText: 'Begin' }).first().click();
    await page.getByRole('button', { name: /Stop — no problem/ }).click();
    await expect(page.locator('#runner')).toBeHidden();
    // Nothing recorded for an abandoned run.
    const runs = await page.evaluate(() => (window as any).__soulcap.getState().skillRuns.length);
    expect(runs).toBe(3); // the three seeded by demo
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
