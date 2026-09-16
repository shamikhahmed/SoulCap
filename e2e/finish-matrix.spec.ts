import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {
  matrixViewports,
  FINISH_THEMES,
  waitForAppReady,
  assertNoHorizontalOverflow,
  assertNotObscured,
  applyFinishTheme,
  writeMatrixResults,
} from './helpers/finish-matrix.js';

const SHOTS = path.join('qa', 'finish-loop', 'shots');
/* Relative `?demo=1` preserves baseURL path (e.g. /SoulCap/). Leading `/` would drop it. */
const ROUTES = [{ id: 'home-demo', path: '?demo=1', primary: '#tabs button[data-tab="now"]' }];

const RUN = process.env.FINISH_MATRIX === '1' || process.env.FINISH_MATRIX_FULL === '1';

// Gate with env so routine verify stays fast; CI job sets FINISH_MATRIX=1 (C-31).
if (RUN) {
  test.describe('finish-matrix', () => {
    test.describe.configure({ mode: 'serial' });
    /* Optional live base (Review 3) — avoids flaky local single-thread serve races. */
    if (process.env.FINISH_MATRIX_BASE) {
      test.use({ baseURL: process.env.FINISH_MATRIX_BASE });
    }
    const failures = [];

    for (const route of ROUTES) {
      for (const vp of matrixViewports()) {
        for (const theme of FINISH_THEMES) {
          test(`${route.id} · ${vp.name} · ${theme}`, async ({ page }) => {
            test.setTimeout(90_000);
            try {
              await page.setViewportSize({ width: vp.width, height: vp.height });
              await page.goto(route.path, { waitUntil: 'domcontentloaded' });
              await waitForAppReady(page, { timeout: 45000 });
              await applyFinishTheme(page, theme);
              /* Match e2e dismissSplash — splash is position:fixed over #tabs until gone. */
              await page.evaluate(() => {
                try {
                  localStorage.setItem('soulcap_theme', document.documentElement.dataset.theme || 'light');
                } catch (e) {}
                const s = document.getElementById('splash');
                if (!s) return;
                s.classList.add('gone');
                s.setAttribute('hidden', '');
                s.style.visibility = 'hidden';
                s.style.opacity = '0';
                s.style.pointerEvents = 'none';
              });
              await page.waitForFunction(() => {
                const s = document.getElementById('splash');
                if (!s) return true;
                if (s.hasAttribute('hidden')) return true;
                const cs = getComputedStyle(s);
                return cs.visibility === 'hidden' || cs.pointerEvents === 'none' || cs.opacity === '0';
              }, null, { timeout: 12000 });
              await page.locator(route.primary).waitFor({ state: 'visible', timeout: 10000 });
              await assertNoHorizontalOverflow(page);
              await assertNotObscured(page, route.primary);
              const dir = path.join(SHOTS, route.id, theme);
              fs.mkdirSync(dir, { recursive: true });
              await page.screenshot({
                path: path.join(dir, `${vp.name}.png`),
                fullPage: false,
              });
            } catch (e) {
              failures.push(`${route.id}/${vp.name}/${theme}: ${e.message}`);
              throw e;
            }
          });
        }
      }
    }

    test.afterAll(() => {
      writeMatrixResults({
        routes: ROUTES.map((r) => r.id),
        viewports: matrixViewports().map((v) => v.name),
        themes: FINISH_THEMES,
        failures,
      });
    });
  });
}
