import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://magento.softwaretestingboard.com/',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  testDir: './tests',
  timeout: 30000,
});
