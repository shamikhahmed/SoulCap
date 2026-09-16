import { defineConfig, devices } from '@playwright/test';

/**
 * Finish-matrix against live Pages (Review 3) — no local webServer.
 * Usage: FINISH_MATRIX=1 playwright test -c playwright.matrix.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/finish-matrix.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.FINISH_MATRIX_BASE || 'https://shamikhahmed.github.io/SoulCap/',
    trace: 'off',
    serviceWorkers: 'block',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 430, height: 932 },
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
});
