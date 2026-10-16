import { test, expect, type Page } from '@playwright/test';

/** Same seed path as safety.spec — demo ready then dismiss splash. */
async function seedDemo(page: Page) {
  await page.goto('/?demo=1', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () =>
      !!(window as any).__soulcap &&
      ((window as any).__APP_READY__ === true ||
        document.documentElement.dataset.appReady === 'true'),
    null,
    { timeout: 30000 },
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
  await expect(page.locator('#tabs')).toBeVisible({ timeout: 10000 });
}

test.describe('SoulCap viewport contract', () => {
  // One seed — resize in-page so we don't re-boot the catalog on every case.
  test('phone ↔ desktop chrome + no tab-bar clipping', async ({ page }) => {
    await seedDemo(page);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(250);
    const phone = await page.locator('#tabs').evaluate((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        position: cs.position,
        flexDir: cs.flexDirection,
        vh: window.innerHeight,
        vw: window.innerWidth,
      };
    });
    expect(phone.position).toBe('fixed');
    expect(phone.top).toBeGreaterThan(phone.vh * 0.6);
    expect(phone.bottom).toBeGreaterThan(phone.vh - 8);
    expect(phone.width).toBeGreaterThan(phone.vw * 0.7);

    for (const tab of ['now', 'calm', 'journal', 'map', 'me']) {
      await page.locator(`#tabs button[data-tab="${tab}"]`).click();
      await page.waitForTimeout(300);
      const ok = await page.evaluate(() => {
        const screen = document.querySelector('.view.on') || document.getElementById('views');
        const nav = document.getElementById('tabs');
        if (!screen || !nav) return false;
        const scroller = screen.scrollHeight > screen.clientHeight ? screen : document.documentElement;
        scroller.scrollTop = scroller.scrollHeight;
        const pad = parseFloat(getComputedStyle(screen).paddingBottom) || 0;
        const navTop = nav.getBoundingClientRect().top;
        if (pad >= nav.getBoundingClientRect().height - 1) {
          return screen.getBoundingClientRect().bottom - pad <= navTop + 2;
        }
        let el: Element = screen;
        while ((el as HTMLElement).lastElementChild) {
          const kids = [...el.children].filter((c) => {
            const s = getComputedStyle(c);
            return s.display !== 'none' && s.visibility !== 'hidden';
          });
          if (!kids.length) break;
          el = kids[kids.length - 1];
        }
        return el.getBoundingClientRect().bottom <= navTop + 2;
      });
      expect(ok, `tab ${tab}: content clear of bottom tabs`).toBe(true);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(250);
    const desk = await page.locator('#tabs').evaluate((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        left: r.left,
        width: r.width,
        height: r.height,
        flexDir: cs.flexDirection,
        vh: window.innerHeight,
      };
    });
    expect(desk.flexDir).toBe('column');
    expect(desk.left).toBeLessThan(16);
    expect(desk.width).toBeGreaterThan(180);
    expect(desk.width).toBeLessThan(280);
    expect(desk.height).toBeGreaterThan(desk.vh * 0.7);
  });
});
