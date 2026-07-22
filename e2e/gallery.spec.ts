import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const GALLERY_DIR = join(process.cwd(), 'docs', 'screenshots', 'gallery');

const SCREENS = [
  { tab: 'now', slug: 'now', label: 'Now' },
  { tab: 'calm', slug: 'calm', label: 'Calm' },
  { tab: 'journal', slug: 'journal', label: 'Journal' },
  { tab: 'map', slug: 'map', label: 'Constellation' },
  { tab: 'me', slug: 'me', label: 'You' },
] as const;

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 800 },
} as const;

type ManifestShot = { file: string; label: string; route: string; viewport: string };

function appendManifest(shots: ManifestShot[]) {
  const manifestPath = join(GALLERY_DIR, 'gallery-manifest.json');
  let existing: { shots: ManifestShot[] } = { shots: [] };
  try {
    existing = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    /* first writer */
  }
  const merged = [...existing.shots.filter((s) => !shots.some((n) => n.file === s.file)), ...shots];
  merged.sort((a, b) => a.file.localeCompare(b.file));
  const version = JSON.parse(readFileSync(join(process.cwd(), 'VERSION.json'), 'utf8')).version;
  writeFileSync(
    manifestPath,
    JSON.stringify({ app: 'SoulCap', version, generated: new Date().toISOString(), shots: merged }, null, 2),
  );
}

async function seedAndDismiss(page: Page) {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await page.evaluate(() => document.getElementById('splash')?.classList.add('gone'));
  await page.waitForTimeout(300);
}

async function captureAll(page: Page, viewport: keyof typeof VIEWPORTS) {
  const shots: ManifestShot[] = [];
  await seedAndDismiss(page);

  let i = 0;
  for (const screen of SCREENS) {
    i += 1;
    await page.evaluate((tab) => {
      (document.querySelector(`#tabs button[data-tab="${tab}"]`) as HTMLElement | null)?.click();
    }, screen.tab);
    await page.waitForTimeout(500);
    const file = `${viewport}-${String(i).padStart(2, '0')}-${screen.slug}.png`;
    await page.screenshot({ path: join(GALLERY_DIR, file), fullPage: true });
    shots.push({ file, label: screen.label, route: `/?demo=1&tab=${screen.tab}`, viewport });
  }

  i += 1;
  await page.evaluate(() => (document.querySelector('#tabs button[data-tab="calm"]') as HTMLElement).click());
  await page.getByRole('button', { name: /Understand what’s happening/ }).click();
  await page.waitForTimeout(400);
  const libraryFile = `${viewport}-${String(i).padStart(2, '0')}-library.png`;
  await page.screenshot({ path: join(GALLERY_DIR, libraryFile), fullPage: true });
  shots.push({ file: libraryFile, label: 'Emotional library', route: 'calm/library', viewport });

  i += 1;
  await page.goto('/?demo=1&panic=1');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await page.waitForTimeout(400);
  const helpFile = `${viewport}-${String(i).padStart(2, '0')}-help.png`;
  await page.screenshot({ path: join(GALLERY_DIR, helpFile), fullPage: true });
  shots.push({ file: helpFile, label: 'Help now', route: '/?demo=1&panic=1', viewport });

  appendManifest(shots);
}

for (const viewport of ['mobile', 'desktop'] as const) {
  test.describe(`Screen gallery — ${viewport}`, () => {
    test.skip(!process.env.CAPTURE_GALLERY, 'Gallery capture runs via `npm run gallery` (CAPTURE_GALLERY=1)');

    test.use({
      viewport: VIEWPORTS[viewport],
      deviceScaleFactor: 2,
      isMobile: viewport === 'mobile',
      hasTouch: viewport === 'mobile',
    });

    test.beforeAll(() => {
      mkdirSync(GALLERY_DIR, { recursive: true });
    });

    test(`capture SoulCap ${viewport} screens`, async ({ page }) => {
      await captureAll(page, viewport);
      expect(true).toBe(true);
    });
  });
}
