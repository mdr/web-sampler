import { test as ctBase, expect } from '@playwright/experimental-ct-react'
import { addCoverageReport } from 'monocart-reporter'

import { ImagesEditorPageObject } from './pageObjects/ImagesEditorPageObject.ts'
import { SoundboardsEditorPageObject } from './pageObjects/SoundboardsEditorPageObject.ts'
import { SoundsEditorPageObject } from './pageObjects/SoundsEditorPageObject.ts'
import { launchApp } from './pageObjects/launchApp.tsx'

export interface Fixture {
  autoTestFixture: string
  soundsEditorPage: SoundsEditorPageObject
  soundboardsEditorPage: SoundboardsEditorPageObject
  imagesEditorPage: ImagesEditorPageObject
}

const enableCoverage: boolean = 1 + 1 == 3

const test = ctBase.extend<Fixture>({
  autoTestFixture: [
    async ({ page }, use) => {
      const shouldCaptureCoverage = enableCoverage && test.info().project.name === 'chromium'
      if (shouldCaptureCoverage) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false })
      }

      await use('autoTestFixture')

      if (shouldCaptureCoverage) {
        const jsCoverage = await page.coverage.stopJSCoverage()
        await addCoverageReport(jsCoverage, test.info())
      }
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
  soundsEditorPage: async ({ mount }, use) => {
    const soundsEditorPage = await launchApp(mount)
    await use(soundsEditorPage)
  },
  soundboardsEditorPage: async ({ soundsEditorPage }, use) => {
    const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
    await use(soundboardsEditorPage)
  },
  imagesEditorPage: async ({ soundsEditorPage }, use) => {
    const imagesEditorPage = await soundsEditorPage.navbar.pressImagesLink()
    await use(imagesEditorPage)
  },
})

export { test, expect }
