import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/capture/captureConstants.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'
import { MountFunction } from '../types.ts'
import { CapturePageObject } from '../pageObjects/CapturePageObject.ts'

test('a captured audio file should be shown after recording', async ({ mount }) => {
  const capturePage = await launchAndStartRecordingOnCapturePage(mount)

  await capturePage.pressStopButton()

  await capturePage.expectAudioElementToBeShown()
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const capturePage = await launchAndStartRecordingOnCapturePage(mount)

  await capturePage.setVolume(50)

  await capturePage.expectVolumeMeterToShowLevel(50)
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const capturePage = await launchAndStartRecordingOnCapturePage(mount)
  await capturePage.expectStopButtonToBeShown()

  await capturePage.wait(MAX_RECORDING_DURATION)

  await capturePage.expectAudioElementToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton({ outcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await capturePage.expectToastToBeShown('No audio available in selected input')
})

const launchAndStartRecordingOnCapturePage = async (mount: MountFunction): Promise<CapturePageObject> => {
  const homePage = await launchApp(mount)
  const capturePage = await homePage.navbar.clickCapture()
  await capturePage.pressRecordButton()
  return capturePage
}
