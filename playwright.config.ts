import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:8788',
    trace: 'on-first-retry'
  },
  // Chromium for both viewports. The iPhone presets run on WebKit, which would
  // mean a browser download in CI for no extra signal on a layout-only difference.
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: false, hasTouch: true }
    },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'python3 -m http.server 8788 --directory docs',
    url: 'http://localhost:8788',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
