import { expect, test as ctBase } from '@playwright/experimental-ct-react'
import { addCoverageReport } from 'monocart-reporter'

const test = ctBase.extend<{ autoTestFixture: string }>({
  autoTestFixture: [
    async ({ page }, use) => {
      // coverage API is chromium only
      if (test.info().project.name === 'chromium') {
        await page.coverage.startJSCoverage({ resetOnNavigation: false })
        await page.coverage.startCSSCoverage({ resetOnNavigation: false })
      }

      await use('autoTestFixture')

      // console.log('autoTestFixture teardown...');
      if (test.info().project.name === 'chromium') {
        const jsCoverage = await page.coverage.stopJSCoverage()
        const cssCoverage = await page.coverage.stopCSSCoverage()
        const coverageList = [...jsCoverage, ...cssCoverage]
        await addCoverageReport(coverageList, test.info())
      }
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
})

export { test, expect }
