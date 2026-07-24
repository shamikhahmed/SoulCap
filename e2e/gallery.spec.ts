import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const GALLERY_DIR = join(process.cwd(), 'docs', 'screenshots', 'gallery');

const VIEWPORTS = {
  mobile: { width: 430, height: 932 },
  desktop: { width: 1280, height: 800 },
} as const;

type ManifestShot = {
  file: string;
  label: string;
  route: string;
  viewport: string;
  pack: string;
  variant: string;
};

/** Surfaces that show chrome, colour, type — enough to prove every look. */
const MATRIX_SHOTS: { kind: string; arg?: string; slug: string; label: string; route: string }[] = [
  { kind: 'tab', arg: 'now', slug: 'now', label: 'Now', route: 'tab/now' },
  { kind: 'tab', arg: 'calm', slug: 'calm', label: 'Calm', route: 'tab/calm' },
  { kind: 'tab', arg: 'journal', slug: 'journal', label: 'Journal', route: 'tab/journal' },
  { kind: 'tab', arg: 'map', slug: 'map', label: 'Constellation', route: 'tab/map' },
  { kind: 'tab', arg: 'me', slug: 'me', label: 'You', route: 'tab/me' },
  { kind: 'settings', slug: 'settings', label: 'Settings', route: 'settings' },
  { kind: 'help', slug: 'help', label: 'Help now', route: 'help' },
  { kind: 'runner', arg: 'box-breathing', slug: 'runner-breathing', label: 'Runner · Breathing', route: 'runner/box-breathing' },
];

/** Full surface list at default look. */
const DEMO_SHOTS: { kind: string; arg?: string; slug: string; label: string; route: string }[] = [
  { kind: 'tab', arg: 'now', slug: 'now', label: 'Now', route: 'tab/now' },
  { kind: 'whats-new', slug: 'whats-new', label: "What's new", route: 'now/whats-new' },
  { kind: 'tab', arg: 'calm', slug: 'calm', label: 'Calm', route: 'tab/calm' },
  { kind: 'tab', arg: 'journal', slug: 'journal', label: 'Journal', route: 'tab/journal' },
  { kind: 'tab', arg: 'map', slug: 'map', label: 'Constellation', route: 'tab/map' },
  { kind: 'tab', arg: 'me', slug: 'me', label: 'You', route: 'tab/me' },
  { kind: 'calm-library', arg: 'all', slug: 'library', label: 'Emotional library', route: 'calm/library' },
  { kind: 'calm-library', arg: 'experiences', slug: 'library-experiences', label: 'Library · Experiences', route: 'calm/library/experiences' },
  { kind: 'calm-library', arg: 'articles', slug: 'library-articles', label: 'Library · Articles', route: 'calm/library/articles' },
  { kind: 'calm-supports', slug: 'daily-supports', label: 'Daily supports', route: 'calm/supports' },
  { kind: 'skill', arg: 'box-breathing', slug: 'skill-box-breathing', label: 'Technique · Box breathing', route: 'skill/box-breathing' },
  { kind: 'skill', arg: 'thought-record', slug: 'skill-thought-record', label: 'Technique · Thought record', route: 'skill/thought-record' },
  { kind: 'runner', arg: 'box-breathing', slug: 'runner-breathing', label: 'Runner · Breathing', route: 'runner/box-breathing' },
  { kind: 'runner', arg: 'thought-record', slug: 'runner-steps', label: 'Runner · Steps', route: 'runner/thought-record' },
  { kind: 'article', arg: 'alarm-system', slug: 'article-alarm', label: 'Article · Alarm system', route: 'article/alarm-system' },
  { kind: 'article', arg: 'wind-down-boundaries', slug: 'article-wind-down', label: 'Article · Wind-down', route: 'article/wind-down-boundaries' },
  { kind: 'experience', slug: 'experience', label: 'Experience detail', route: 'experience' },
  { kind: 'experience-picker', slug: 'experience-picker', label: 'Experience picker', route: 'experience/picker' },
  { kind: 'path', slug: 'guided-path', label: 'Guided Path · start', route: 'path/start' },
  { kind: 'checkin-detail', slug: 'checkin-detail', label: 'Check-in detail', route: 'checkin/detail' },
  { kind: 'drip', slug: 'drip', label: 'Gentle questions', route: 'drip' },
  { kind: 'settings', slug: 'settings', label: 'Settings', route: 'settings' },
  { kind: 'about', slug: 'about', label: 'About SoulCap', route: 'about' },
  { kind: 'safety-plan', slug: 'safety-plan', label: 'My plan', route: 'me/plan' },
  { kind: 'screener-pick', slug: 'screener-pick', label: 'Reflection screeners', route: 'screener/pick' },
  { kind: 'screener-run', slug: 'screener-run', label: 'Screener · in progress', route: 'screener/run' },
  { kind: 'principles', slug: 'principles', label: 'Principles', route: 'me/principles' },
  { kind: 'manual', slug: 'manual', label: 'Personal Manual', route: 'me/manual' },
  { kind: 'patterns', slug: 'patterns', label: 'Patterns', route: 'me/patterns' },
  { kind: 'weekly', slug: 'weekly', label: 'Weekly overview', route: 'me/weekly' },
  { kind: 'timeline', slug: 'timeline', label: 'Timeline', route: 'me/timeline' },
  { kind: 'profile', slug: 'profile', label: 'Profile', route: 'me/profile' },
  { kind: 'story', slug: 'your-story', label: 'Your story', route: 'me/story' },
  { kind: 'knows', slug: 'knows', label: 'What SoulCap knows', route: 'me/knows' },
  { kind: 'reset-menu', slug: 'reset-menu', label: 'Reset menu', route: 'reset-menu' },
  { kind: 'park-thought', slug: 'park-thought', label: 'Thought parking', route: 'park-thought' },
  { kind: 'new-entry', slug: 'journal-new', label: 'New journal entry', route: 'journal/new' },
  { kind: 'journal-editor', slug: 'journal-editor', label: 'Journal editor', route: 'journal/editor' },
  { kind: 'cover', slug: 'journal-cover', label: 'Journal cover', route: 'journal/cover' },
  { kind: 'add-person', slug: 'add-person', label: 'Add someone', route: 'map/add' },
  { kind: 'person', slug: 'person', label: 'Person detail', route: 'map/person' },
  { kind: 'help', slug: 'help', label: 'Help now', route: 'help' },
];

type Look = {
  theme?: string | null;
  appearance?: {
    text?: string;
    density?: string;
    accent?: string;
    contrast?: string;
    reduceTransparency?: boolean;
    motion?: string;
  };
};

const DEFAULT_APPEARANCE = {
  text: 'standard',
  density: 'compact',
  accent: 'plum',
  contrast: 'standard',
  reduceTransparency: false,
  motion: 'balanced',
};

const THEMES: { id: string; theme: string | null; label: string }[] = [
  { id: 'auto', theme: null, label: 'Auto' },
  { id: 'light', theme: 'light', label: 'Light' },
  { id: 'dark', theme: 'dark', label: 'Dark' },
  { id: 'night', theme: 'night', label: 'Night' },
  { id: 'ocean', theme: 'ocean', label: 'Ocean' },
  { id: 'forest', theme: 'forest', label: 'Forest' },
  { id: 'rain', theme: 'rain', label: 'Rain' },
  { id: 'space', theme: 'space', label: 'Space' },
  { id: 'sunrise', theme: 'sunrise', label: 'Sunrise' },
  { id: 'minimal', theme: 'minimal', label: 'Minimal' },
  { id: 'amoled', theme: 'amoled', label: 'AMOLED' },
];

/** One axis change at a time (plus defaults already covered by theme pack). */
const APPEARANCE_LOOKS: { id: string; label: string; look: Look }[] = [
  { id: 'text-large', label: 'Text · Large', look: { theme: 'light', appearance: { text: 'large' } } },
  { id: 'density-comfortable', label: 'Density · Comfortable', look: { theme: 'light', appearance: { density: 'comfortable' } } },
  { id: 'contrast-high', label: 'Contrast · High', look: { theme: 'light', appearance: { contrast: 'high' } } },
  { id: 'transparency-reduced', label: 'Transparency · Reduced', look: { theme: 'dark', appearance: { reduceTransparency: true } } },
  { id: 'accent-lilac', label: 'Accent · Lilac', look: { theme: 'light', appearance: { accent: 'lilac' } } },
  { id: 'accent-mulberry', label: 'Accent · Mulberry', look: { theme: 'light', appearance: { accent: 'mulberry' } } },
  { id: 'accent-indigo', label: 'Accent · Indigo', look: { theme: 'light', appearance: { accent: 'indigo' } } },
  { id: 'motion-vivid', label: 'Motion · Vivid', look: { theme: 'light', appearance: { motion: 'vivid' } } },
  { id: 'motion-still', label: 'Motion · Still', look: { theme: 'light', appearance: { motion: 'still' } } },
  {
    id: 'combo-large-comfortable-high',
    label: 'Combo · Large + Comfortable + High contrast',
    look: { theme: 'dark', appearance: { text: 'large', density: 'comfortable', contrast: 'high' } },
  },
];

function writeManifest(shots: ManifestShot[], viewport: string) {
  const manifestPath = join(GALLERY_DIR, 'gallery-manifest.json');
  let existing: { shots: ManifestShot[] } = { shots: [] };
  try {
    existing = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    /* first writer */
  }
  const merged = [...existing.shots.filter((s) => s.viewport !== viewport), ...shots];
  merged.sort((a, b) => a.file.localeCompare(b.file));
  const version = JSON.parse(readFileSync(join(process.cwd(), 'VERSION.json'), 'utf8')).version;
  writeFileSync(
    manifestPath,
    JSON.stringify({ app: 'SoulCap', version, generated: new Date().toISOString(), shots: merged }, null, 2),
  );
}

async function dismissSplash(page: Page) {
  await page.evaluate(() => document.getElementById('splash')?.classList.add('gone'));
  await page.waitForTimeout(200);
}

async function seedDemo(page: Page) {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await dismissSplash(page);
  await page.evaluate(() => {
    const api = (window as any).__soulcap;
    if (api && api.setSeenVersion) api.setSeenVersion(api.version);
  });
}

async function applyLook(page: Page, look: Look) {
  await page.evaluate(
    ({ look, def }) => {
      const api = (window as any).__soulcap;
      const s = api.getState();
      s.appearance = Object.assign({}, def, look.appearance || {});
      const theme = look.theme !== undefined ? look.theme : null;
      api.setTheme(theme);
    },
    { look, def: DEFAULT_APPEARANCE },
  );
  await page.waitForTimeout(120);
}

async function openSurface(page: Page, kind: string, arg?: string) {
  await page.evaluate(
    ({ kind, arg }) => {
      (window as any).__soulcap.galleryOpen(kind, arg);
    },
    { kind, arg },
  );
  if (kind === 'runner') await page.waitForTimeout(600);
  else await page.waitForTimeout(200);
}

async function snap(
  page: Page,
  shots: ManifestShot[],
  viewport: string,
  pack: string,
  variant: string,
  slug: string,
  label: string,
  route: string,
) {
  const file = `${viewport}__${variant}__${slug}.png`;
  await page.waitForTimeout(280);
  await page.screenshot({ path: join(GALLERY_DIR, file), fullPage: true });
  shots.push({ file, label, route, viewport, pack, variant });
}

async function captureFreshFlow(page: Page, viewport: keyof typeof VIEWPORTS, shots: ManifestShot[]) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await dismissSplash(page);
  await snap(page, shots, viewport, 'default', 'default', 'welcome', 'Welcome', 'welcome');

  await page.getByRole('button', { name: 'Begin' }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'onboard-age', 'Onboarding · age', 'onboard/age');

  await page.getByRole('button', { name: /Under 18/ }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'under-18', 'Under 18', 'onboard/under-18');

  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  await page.waitForFunction(() => Boolean((window as any).__soulcap));
  await dismissSplash(page);
  await page.getByRole('button', { name: 'Begin' }).click();
  await page.getByRole('button', { name: '18 or older' }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'onboard-name', 'Onboarding · name', 'onboard/name');

  await page.getByRole('button', { name: 'Skip', exact: true }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'onboard-consent', 'Onboarding · consent', 'onboard/consent');

  await page.getByRole('button', { name: 'I understand' }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'onboard-motion', 'Onboarding · motion', 'onboard/motion');

  await page.getByRole('button', { name: 'Skip', exact: true }).click();
  await page.waitForTimeout(300);
  await snap(page, shots, viewport, 'default', 'default', 'onboard-concerns', 'Onboarding · concerns', 'onboard/concerns');
}

async function capturePathResult(page: Page, viewport: string, shots: ManifestShot[]) {
  await applyLook(page, { theme: 'light', appearance: DEFAULT_APPEARANCE });
  await page.evaluate(() => (window as any).__soulcap.galleryOpen('path'));
  await page.waitForTimeout(300);
  const sheet = page.locator('#sheetPanel');
  await sheet.getByRole('button', { name: 'Wired', exact: true }).click();
  await sheet.getByRole('button', { name: 'Continue' }).click();
  await sheet.getByRole('button', { name: /Worry/ }).click();
  await sheet.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(400);
  await snap(page, shots, viewport, 'default', 'default', 'guided-path-result', 'Guided Path · result', 'path/result');
  await page.evaluate(() => (window as any).__soulcap.galleryReset());
}

async function captureMatrixScreens(
  page: Page,
  viewport: string,
  shots: ManifestShot[],
  pack: string,
  variant: string,
  lookLabel: string,
  look: Look,
) {
  await applyLook(page, look);
  for (const s of MATRIX_SHOTS) {
    await openSurface(page, s.kind, s.arg);
    await snap(
      page,
      shots,
      viewport,
      pack,
      variant,
      s.slug,
      `${s.label} · ${lookLabel}`,
      s.route,
    );
    await page.evaluate(() => (window as any).__soulcap.galleryReset());
  }
}

async function captureAll(page: Page, viewport: keyof typeof VIEWPORTS) {
  const shots: ManifestShot[] = [];

  await captureFreshFlow(page, viewport, shots);
  await seedDemo(page);
  await applyLook(page, { theme: 'light', appearance: DEFAULT_APPEARANCE });

  for (const s of DEMO_SHOTS) {
    await openSurface(page, s.kind, s.arg);
    await snap(page, shots, viewport, 'default', 'default', s.slug, s.label, s.route);
    await page.evaluate(() => (window as any).__soulcap.galleryReset());
  }
  await capturePathResult(page, viewport, shots);

  for (const t of THEMES) {
    await captureMatrixScreens(page, viewport, shots, 'theme', `theme-${t.id}`, t.label, {
      theme: t.theme,
      appearance: DEFAULT_APPEARANCE,
    });
  }

  for (const a of APPEARANCE_LOOKS) {
    await captureMatrixScreens(page, viewport, shots, 'appearance', a.id, a.label, a.look);
  }

  writeManifest(shots, viewport);
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

    test(`capture SoulCap ${viewport} screens`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== viewport, 'matched project only');
      test.setTimeout(45 * 60 * 1000);
      for (const f of readdirSync(GALLERY_DIR)) {
        if (!f.endsWith('.png')) continue;
        if (f.startsWith(viewport + '__') || f.startsWith(viewport + '-')) {
          try {
            unlinkSync(join(GALLERY_DIR, f));
          } catch {
            /* race with other worker */
          }
        }
      }
      await captureAll(page, viewport);
      expect(true).toBe(true);
    });
  });
}
