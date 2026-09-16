import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    // 127.0.0.1 matches ThreadingHTTPServer bind (avoids ::1 localhost flake).
    // personas.spec allows both localhost and 127.0.0.1.
    baseURL: 'http://127.0.0.1:8788',
    trace: 'on-first-retry',
    // Avoid stale SW races when shell assets change mid-loop (brand.css etc.)
    serviceWorkers: 'block'
  },
  // Chromium for both viewports. The iPhone presets run on WebKit, which would
  // mean a browser download in CI for no extra signal on a layout-only difference.
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 430, height: 932 }, isMobile: false, hasTouch: true }
    },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    // Node static: Python http.server resets concurrent GETs (app.js never loads).
    command: 'node scripts/serve-docs.mjs',
    url: 'http://127.0.0.1:8788',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
