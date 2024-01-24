import { test } from '@playwright/experimental-ct-react'
import { launchApp } from './pageObjects/launchApp.tsx'

test('recording audio from the Capture page should work', async ({ mount }) => {
  const homePage = await launchApp(mount)

  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  await capturePage.setVolume(50)
  await capturePage.waitForVolumeMeterToShowLevel(50)

  await capturePage.pressStopButton()
})
