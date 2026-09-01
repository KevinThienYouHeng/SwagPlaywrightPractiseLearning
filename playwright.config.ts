/// <reference types="node" /> 
import { defineConfig, devices } from '@playwright/test';


const mainTests = '**/main/*.spec.ts';
const experimentTests = '**/experiments/*.spec.ts';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' :'dot',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  /* Run the main suite by default. Experiments are opt-in. */
  projects: [
    {
      name: 'chromium',
      testMatch: mainTests,
      use: { ...devices['Desktop Chrome'] },
    },

    ...(process.env.RUN_EXPERIMENTS === 'true'
      ? [
          {
            name: 'experiments',
            testMatch: experimentTests,
            use: { ...devices['Desktop Chrome'] },
          },
        ]
      : []),
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


//List down all playwright current compatible devices
//node -e "require('@playwright/test').devices; console.log(Object.keys(require('@playwright/test').devices).join('\n'))"
