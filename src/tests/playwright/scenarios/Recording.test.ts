import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/capture/captureConstants.ts'

test('recording audio from the Capture page', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  await capturePage.setVolume(50)
  await capturePage.expectVolumeMeterToShowLevel(50)

  // await capturePage.checkScreenshot('mid-recording')

  await capturePage.pressStopButton()
  await capturePage.completeRecording()
  await capturePage.expectAudioElementToBeShown()

  // await capturePage.checkScreenshot('after-recording')
})

test('after 20 seconds recording should stop automatically', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  await capturePage.wait(MAX_RECORDING_DURATION)
  await capturePage.expectAudioElementToBeShown()
})
