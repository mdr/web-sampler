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
  reporter: [
    ['list', { printSteps: !!process.env.CI }],
    ['html', { open: 'never' }],
    [
      'monocart-reporter',
      {
        name: 'Playwright Component Test Coverage',
        outputFile: 'report/index.html',
        // logging: 'debug',
        coverage: {
          sourceFilter: (sourcePath: string) =>
            !(sourcePath.startsWith('node_modules/') || sourcePath === '__vite-browser-external'),

          sourcePath: (sp: string) => {
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
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    ctPort: 3100,
    video: 'on', // 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // new Chromium headless (https://playwright.dev/docs/release-notes#try-new-chromium-headless):
        channel: 'chromium',
        launchOptions: {
          args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
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
