import { expect, test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/editSoundPage/recordingConstants.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { MountFunction } from '../types.ts'
import { EditSoundPageObject } from '../pageObjects/EditSoundPageObject.ts'

test('captured audio file should be shown after recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)

  await editSoundPage.pressStopButton()

  await editSoundPage.expectAudioElementToBeShown()
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)

  await editSoundPage.setVolume(50)

  await editSoundPage.expectVolumeMeterToShowLevel(50)
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)
  await editSoundPage.expectStopButtonToBeShown()

  await editSoundPage.wait(MAX_RECORDING_DURATION)

  await editSoundPage.expectAudioElementToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.pressNewSound()

  await editSoundPage.pressRecord({ primedOutcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await editSoundPage.expectToastToBeShown('No audio available in selected input')
})

test('navigating away from the page should cancel recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)
  expect(await editSoundPage.getAudioRecorderState()).toBe(AudioRecorderState.RECORDING)

  await editSoundPage.pressHomeLink()

  expect(await editSoundPage.getAudioRecorderState()).toBe(AudioRecorderState.IDLE)
})

const launchAndStartRecordingOnEditSoundPage = async (mount: MountFunction): Promise<EditSoundPageObject> => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.pressNewSound()
  await editSoundPage.pressRecord()
  return editSoundPage
}
