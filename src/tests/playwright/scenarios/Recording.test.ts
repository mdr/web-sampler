import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/capture/captureConstants.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'

test('recording audio from the Capture page', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  await capturePage.setVolume(50)
  await capturePage.expectVolumeMeterToShowLevel(50)

  await capturePage.pressStopButton()
  await capturePage.expectAudioElementToBeShown()
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()
  await capturePage.pressRecordButton()
  await capturePage.expectStopButtonToBeShown()

  await capturePage.wait(MAX_RECORDING_DURATION)

  await capturePage.expectAudioElementToBeShown()
})

test('an error toast should be shown if no audio is available on selected source', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton({ outcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await capturePage.expectToastToBeShown('No audio available in selected input')
})
