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
const ROUTES = [{ id: 'home-demo', path: '/?demo=1', primary: '#tabs button[data-tab="now"]' }];

const RUN = process.env.FINISH_MATRIX === '1' || process.env.FINISH_MATRIX_FULL === '1';

// Gate with env so routine verify stays fast; CI job sets FINISH_MATRIX=1 (C-31).
if (RUN) {
  test.describe('finish-matrix', () => {
    test.describe.configure({ mode: 'serial' });
    const failures = [];

    for (const route of ROUTES) {
      for (const vp of matrixViewports()) {
        for (const theme of FINISH_THEMES) {
          test(`${route.id} · ${vp.name} · ${theme}`, async ({ page }) => {
            test.setTimeout(90_000);
            try {
              await page.setViewportSize({ width: vp.width, height: vp.height });
              /* Theme after boot — evaluate on about:blank can race a cold shell. */
              await page.goto(route.path);
              await waitForAppReady(page, { timeout: 45_000 });
              await applyFinishTheme(page, theme);
              /* SoulCap splash sits fixed over the tab bar until dismissed. */
              await page.evaluate(() => {
                const s = document.getElementById('splash');
                if (!s) return;
                s.classList.add('gone');
                s.setAttribute('hidden', '');
                s.style.visibility = 'hidden';
                s.style.pointerEvents = 'none';
              });
              await page.locator(route.primary).waitFor({ state: 'visible', timeout: 10_000 });
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
