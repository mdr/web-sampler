import { defineConfig, devices } from '@playwright/experimental-ct-react'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'src/tests/playwright',
  /* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
  snapshotDir: 'tests/__snapshots__',
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            // '--use-fake-ui-for-media-stream',
            // '--use-fake-device-for-media-stream',
            // '--use-file-for-fake-audio-capture=/Users/matt/Downloads/78084f90-c328-4866-8127-a84cbfff7233.wav',
          ],
        },
      },
    },
  ],
})
