import { expect, test as ctBase } from '@playwright/experimental-ct-react'
import { addCoverageReport } from 'monocart-reporter'

const test = ctBase.extend<{ autoTestFixture: string }>({
  autoTestFixture: [
    async ({ page }, use) => {
      if (test.info().project.name === 'chromium') {
        await page.coverage.startJSCoverage({ resetOnNavigation: false })
      }

      await use('autoTestFixture')

      if (test.info().project.name === 'chromium') {
        const jsCoverage = await page.coverage.stopJSCoverage()
        await addCoverageReport(jsCoverage, test.info())
      }
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
})

export { test, expect }
