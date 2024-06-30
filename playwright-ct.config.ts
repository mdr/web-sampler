import { defineConfig, devices } from '@playwright/experimental-ct-react'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'src/tests/playwright',
  snapshotDir: 'tests/__snapshots__',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    [
      'monocart-reporter',
      {
        name: 'Playwright Component Test Coverage',
        outputFile: 'report/index.html',
        // logging: 'debug',
        coverage: {
          sourceFilter: (sourcePath) => sourcePath.search(/src\//) !== -1 && sourcePath.search(/node_modules/) === -1,
          sourcePath: (sp) => {
            const list = sp.split('/')

            // locate to playwright dist path
            if (sp.startsWith('localhost')) {
              list[0] = 'playwright/.cache'
            }

            return list.join('/')
          },
          reports: ['v8', 'codecov'],
          lcov: true,
        },
      },
    ],
  ],
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
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})
