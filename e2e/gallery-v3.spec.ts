/**
 * SoulCap gallery v3 — schema-v2 capture (Perfection Loop §9).
 * Run: npm run gallery:v3
 * Preserves docs/screenshots/gallery/gallery-manifest.v1.json (legacy).
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  GALLERY_VIEWPORTS,
  galleryClockInitScript,
  isGalleryCapture,
  prepareGalleryPage,
  shotEntry,
  shotRelativePath,
} from './helpers/gallery-capture-helpers.mjs';

const GALLERY_DIR = join(process.cwd(), 'docs', 'screenshots', 'gallery');
const MANIFEST = join(GALLERY_DIR, 'gallery-manifest.json');

const SCREENS = [
  { kind: 'tab', arg: 'now', group: 'Now', screen: 'Now', state: 'demo', route: 'tab/now', caption: 'Now — quiet arrival.' },
  { kind: 'tab', arg: 'calm', group: 'Calm', screen: 'Calm', state: 'demo', route: 'tab/calm', caption: 'Calm techniques.' },
  { kind: 'tab', arg: 'journal', group: 'Journal', screen: 'Journal', state: 'demo', route: 'tab/journal', caption: 'Journal home.' },
  { kind: 'tab', arg: 'map', group: 'Map', screen: 'Constellation', state: 'demo', route: 'tab/map', caption: 'People constellation.' },
  { kind: 'tab', arg: 'me', group: 'You', screen: 'You', state: 'demo', route: 'tab/me', caption: 'You hub.' },
  { kind: 'help', group: 'Help', screen: 'Help now', state: 'default', route: 'help', caption: 'Help now — crisis path; copy locked.' },
  { kind: 'settings', group: 'Me', screen: 'Settings', state: 'default', route: 'settings', caption: 'Settings, lock, export.' },
  {
    kind: 'runner',
    arg: 'box-breathing',
    group: 'Calm',
    screen: 'Runner · Breathing',
    state: 'demo',
    route: 'runner/box-breathing',
    caption: 'Breathing runner.',
  },
] as const;

const DEVICES = ['iphone', 'ipad', 'mac'] as const;
const THEMES = ['light', 'dark'] as const;

type Shot = ReturnType<typeof shotEntry>;

test.skip(!isGalleryCapture(), 'Run via CAPTURE_GALLERY=1 (npm run gallery:v3)');

async function dismissSplash(page: Page) {
  await page.evaluate(() => {
    const s = document.getElementById('splash');
    if (!s) return;
    s.classList.add('gone');
    s.setAttribute('hidden', '');
    s.style.visibility = 'hidden';
    s.style.opacity = '0';
    s.style.pointerEvents = 'none';
  });
}

async function seedDemo(page: Page) {
  await page.goto('/?demo=1', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => Boolean((window as any).__soulcap) && (window as any).__APP_READY__ === true,
    null,
    { timeout: 60_000 },
  );
  await dismissSplash(page);
  await page.evaluate(() => {
    const api = (window as any).__soulcap;
    if (api?.setSeenVersion) api.setSeenVersion(api.version);
  });
}

async function setAppTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    const api = (window as any).__soulcap;
    const s = api.getState();
    s.theme = t;
    s.appearance = Object.assign({}, s.appearance || {}, {
      text: 'standard',
      density: 'compact',
      accent: 'plum',
      contrast: 'standard',
      reduceTransparency: false,
      motion: 'still',
    });
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-text', 'standard');
    document.documentElement.setAttribute('data-density', 'compact');
    document.documentElement.setAttribute('data-accent', 'plum');
    document.documentElement.setAttribute('data-contrast', 'standard');
    document.documentElement.setAttribute('data-transparency', 'standard');
    document.documentElement.setAttribute('data-motion', 'still');
    try {
      localStorage.setItem('soulcap_theme', t);
      localStorage.setItem('soulcap_appearance', JSON.stringify(s.appearance));
    } catch {
      /* ignore */
    }
  }, theme);
}

async function openSurface(page: Page, kind: string, arg?: string) {
  await page.evaluate(
    ({ kind, arg }) => {
      (window as any).__soulcap.galleryOpen(kind, arg);
    },
    { kind, arg },
  );
  if (kind === 'runner') await page.waitForTimeout(500);
  else await page.waitForTimeout(180);
}

function mergeWriteManifest(shots: Shot[]) {
  mkdirSync(GALLERY_DIR, { recursive: true });
  let legacyCount = 392;
  try {
    const v1 = JSON.parse(readFileSync(join(GALLERY_DIR, 'gallery-manifest.v1.json'), 'utf8'));
    legacyCount = Array.isArray(v1.shots) ? v1.shots.length : legacyCount;
  } catch {
    /* optional */
  }
  let existing: { shots?: Shot[] } = {};
  try {
    existing = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  } catch {
    /* first */
  }
  const byKey = new Map<string, Shot>();
  for (const s of existing.shots || []) {
    if (s && s.theme && s.device && s.file) byKey.set(`${s.theme}/${s.device}/${s.file}`, s);
  }
  for (const s of shots) {
    byKey.set(`${s.theme}/${s.device}/${s.file}`, s);
  }
  const version = JSON.parse(readFileSync(join(process.cwd(), 'VERSION.json'), 'utf8')).version;
  const sorted = [...byKey.values()].sort((a, b) => a.file.localeCompare(b.file));
  writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        app: 'SoulCap',
        version,
        capturedAt: '2026-10-14T09:41:00.000Z',
        accent: '#8b7ec8',
        schema: 2,
        legacyShotCount: legacyCount,
        note: 'v3 capture — primary surfaces × light/dark × iphone/ipad/mac. Help copy unchanged.',
        shots: sorted,
      },
      null,
      2,
    ) + '\n',
  );
}

for (const device of DEVICES) {
  for (const theme of THEMES) {
    test.describe(`gallery v3 · ${theme} · ${device}`, () => {
      const vp = GALLERY_VIEWPORTS[device];
      test.use({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: device === 'iphone' || device === 'ipad',
        hasTouch: device === 'iphone' || device === 'ipad',
        colorScheme: theme,
      });

      test.beforeEach(async ({ context }) => {
        await context.addInitScript(galleryClockInitScript());
      });

      test(`capture ${SCREENS.length} screens`, async ({ page }) => {
        test.setTimeout(300_000);
        const shots: Shot[] = [];
        await seedDemo(page);
        await prepareGalleryPage(page, { theme, colorScheme: theme, setAppTheme, freezeMotion: true });

        for (const screen of SCREENS) {
          await openSurface(page, screen.kind, 'arg' in screen ? screen.arg : undefined);
          const file = shotRelativePath({
            theme,
            device,
            group: screen.group,
            screen: screen.screen,
            state: screen.state,
            ext: 'png',
          });
          const abs = join(GALLERY_DIR, file);
          mkdirSync(dirname(abs), { recursive: true });
          await page.waitForTimeout(200);
          await page.screenshot({ path: abs, fullPage: true, type: 'png' });
          const box = await page.evaluate(() => ({
            w: window.innerWidth,
            h: Math.min(document.documentElement.scrollHeight, 8000),
          }));
          shots.push(
            shotEntry({
              id: `${screen.group}-${screen.screen}-${screen.state}-${theme}-${device}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
              group: screen.group,
              screen: screen.screen,
              state: screen.state,
              theme,
              device,
              file,
              route: `/${screen.route}`,
              caption: screen.caption,
              w: box.w * vp.deviceScaleFactor,
              h: box.h * vp.deviceScaleFactor,
            }),
          );
          expect(existsSync(abs)).toBeTruthy();
        }

        mergeWriteManifest(shots);
        expect(shots.length).toBe(SCREENS.length);
      });
    });
  }
}
