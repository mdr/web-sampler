import { test } from '@playwright/experimental-ct-react'
import { launchApp } from './pageObjects/launchApp.tsx'

test.use({ viewport: { width: 500, height: 500 } })

test('navigating to the Capture page should work', async ({ mount }) => {
  const homePage = await launchApp(mount)

  const capturePage = await homePage.clickNavbarCaptureLink()

  await capturePage.expectContainsText('Record')
  await capturePage.pressRecordButton()
})
