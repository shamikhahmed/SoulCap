#!/usr/bin/env node
/**
 * iPhone/WebKit behaviour check (Cap fleet mobile bugs), adapted from ScentCap / PulseCap.
 * Usage: serve docs on 8810 → node scripts/ios-behaviour-check.mjs http://127.0.0.1:8810/
 */
import { chromium, webkit, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || 'http://127.0.0.1:8810/').replace(/\/?$/, '/');
const SW_PATH = process.argv[3] || path.join(__dirname, '../docs/sw.js');
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const step = async (name, fn) => {
  try {
    await fn();
  } catch (e) {
    check(name, false, String(e.message || e).split('\n')[0]);
  }
};

/* Prefer WebKit (fleet default). Fall back to Chromium + iPhone metrics if WebKit aborts (CI / host quirk). */
let browser;
let engine = 'webkit';
try {
  browser = await webkit.launch();
} catch (e) {
  engine = 'chromium';
  browser = await chromium.launch();
  console.error('(ios-behaviour-check: WebKit unavailable, using Chromium + iPhone 15 Pro metrics)');
}
const ctx = await browser.newContext({ ...devices['iPhone 15 Pro'], serviceWorkers: 'block' });
const page = await ctx.newPage();
page.setDefaultTimeout(8000);
check('engine', true, engine);

await page.goto(BASE + '?demo=1');
await page.waitForFunction(
  () => !!(window.__soulcap) && (window.__APP_READY__ === true || document.documentElement.dataset.appReady === 'true'),
  { timeout: 45000 },
);
await page.evaluate(() => {
  const s = document.getElementById('splash');
  if (!s) return;
  s.classList.add('gone');
  s.setAttribute('hidden', '');
  s.style.visibility = 'hidden';
  s.style.opacity = '0';
  s.style.pointerEvents = 'none';
});
await page.waitForSelector('#tabs', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(800);
await page.evaluate(() => { window.__noReload = 1; });

const goTab = async (id) => {
  await page.evaluate((t) => {
    if (window.__soulcap && window.__soulcap.selectTab) window.__soulcap.selectTab(t);
    else {
      const btn = document.querySelector('#tabs button[data-tab="' + t + '"]');
      if (btn) btn.click();
    }
  }, id);
  await page.waitForTimeout(700);
};

const covered = await page.evaluate(() =>
  [...document.querySelectorAll('#tabs button')]
    .filter((t) => t.offsetParent !== null)
    .filter((t) => {
      const r = t.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !t.contains(hit);
    })
    .map((t) => t.getAttribute('data-tab') || t.textContent.trim()),
);
check('tab bar controls tappable', covered.length === 0, covered.join(','));

const small = await page.evaluate(() =>
  [...document.querySelectorAll('#tabs button')]
    .filter((t) => t.offsetParent !== null)
    .filter((t) => {
      const r = t.getBoundingClientRect();
      return r.width < 44 || r.height < 44;
    }).length,
);
check('hit areas ≥44pt (tabs)', small === 0, `${small} small`);

const bar = await page.evaluate(() => {
  const nav = document.getElementById('tabs');
  const view = document.querySelector('.view.on') || document.getElementById('views');
  const r = nav.getBoundingClientRect();
  return {
    gap: innerHeight - r.bottom,
    pad: view ? parseFloat(getComputedStyle(view).paddingBottom) : 0,
    h: r.height,
  };
});
check('tab bar floats ≥14px above bottom', bar.gap >= 14, JSON.stringify(bar));
check('content padding clears tab bar', bar.pad >= bar.h + 48, JSON.stringify(bar));

for (const tab of ['now', 'calm', 'journal', 'map', 'me']) {
  await goTab(tab);
  const m = await page.evaluate(() => {
    const view = document.querySelector('.view.on');
    return {
      sw: document.documentElement.scrollWidth,
      iw: innerWidth,
      docScroll: document.scrollingElement.scrollHeight > innerHeight,
      viewOverflow: view ? getComputedStyle(view).overflowY : 'missing',
      body: getComputedStyle(document.body).overflowY,
    };
  });
  check(`no sideways overflow · ${tab}`, m.sw <= m.iw + 1, `${m.sw} > ${m.iw}`);
  check(
    `document scrolls (no inner scroller) · ${tab}`,
    (m.viewOverflow === 'visible') && m.body !== 'hidden',
    JSON.stringify(m),
  );
}

check(
  'programmatic scroll lands instantly',
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.id = '__hig_scroll_spacer';
    spacer.style.height = '1200px';
    document.body.appendChild(spacer);
    window.scrollTo(0, 300);
    const y = window.scrollY;
    window.scrollTo(0, 0);
    spacer.remove();
    return y >= 250;
  }),
);

await step('navigation by tapping', async () => {
  await goTab('now');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(200);
  await page.locator('#tabs button[data-tab="calm"]').tap();
  await page.waitForTimeout(800);
  const nav = await page.evaluate(() => ({
    y: scrollY,
    on: document.querySelector('#tabs button[aria-selected="true"]')?.getAttribute('data-tab'),
    marker: window.__noReload,
  }));
  check('tab tap keeps shell (no reload)', nav.on === 'calm' && nav.marker === 1, JSON.stringify(nav));
  check('new screen opens at top', nav.y === 0, `scrollY ${nav.y}`);
});

let smallInputs = -1;
await step('sheet flow', async () => {
  await goTab('me');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => scrollY);
  await page.evaluate(() => {
    window.__soulcap.openSheet(function (p) {
      const grab = document.createElement('div');
      grab.className = 'grab';
      p.appendChild(grab);
      const h = document.createElement('h2');
      h.textContent = 'HIG check';
      p.appendChild(h);
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.setAttribute('aria-label', 'Sample');
      p.appendChild(inp);
      const done = document.createElement('button');
      done.className = 'btn';
      done.textContent = 'Done';
      done.onclick = function () { window.__soulcap.closeSheet(); };
      p.appendChild(done);
    });
  });
  await page.waitForSelector('#sheet.on', { timeout: 5000 });
  await page.waitForTimeout(400);
  const locked = await page.evaluate(() => document.body.style.position);
  smallInputs = await page.evaluate(() =>
    [...document.querySelectorAll('#sheet input, #sheet select, #sheet textarea')]
      .filter((el) => el.offsetParent !== null && parseFloat(getComputedStyle(el).fontSize) < 16).length,
  );
  await page.evaluate(() => window.__soulcap.closeSheet());
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => scrollY);
  check('page locked behind sheet', locked === 'fixed', `body position "${locked}"`);
  check('sheet keeps scroll position', Math.abs(after - before) < 4, `before ${before} after ${after}`);
});
check('inputs ≥16px (no zoom-on-focus)', smallInputs === 0, `${smallInputs} small`);
check('no reload during session', (await page.evaluate(() => window.__noReload)) === 1);

const sw = fs.readFileSync(SW_PATH, 'utf8');
const autoSkip = sw.replace(/addEventListener\(['"]message['"][\s\S]*?\}\);/, '');
check('SW: skipWaiting only on user request', !/skipWaiting\(\)/.test(autoSkip));
check('SW: no auto clients.claim', !/clients\.claim\(\)/.test(autoSkip));

await browser.close();
let fail = 0;
for (const r of results) {
  if (!r.ok) fail++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok || !r.detail ? '' : `  (${r.detail})`}`);
}
process.exit(fail ? 1 : 0);
