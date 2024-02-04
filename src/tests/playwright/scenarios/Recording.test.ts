import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/capture/captureConstants.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'
import { MountFunction } from '../types.ts'
import { EditSoundPageObject } from '../pageObjects/EditSoundPageObject.ts'

test('a captured audio file should be shown after recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnCapturePage(mount)

  await editSoundPage.pressStopButton()

  await editSoundPage.expectAudioElementToBeShown()
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnCapturePage(mount)

  await editSoundPage.setVolume(50)

  await editSoundPage.expectVolumeMeterToShowLevel(50)
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnCapturePage(mount)
  await editSoundPage.expectStopButtonToBeShown()

  await editSoundPage.wait(MAX_RECORDING_DURATION)

  await editSoundPage.expectAudioElementToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.clickNewSoundButton()

  await editSoundPage.pressRecordButton({ outcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await editSoundPage.expectToastToBeShown('No audio available in selected input')
})

const launchAndStartRecordingOnCapturePage = async (mount: MountFunction): Promise<EditSoundPageObject> => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.clickNewSoundButton()
  await editSoundPage.pressRecordButton()
  return editSoundPage
}
