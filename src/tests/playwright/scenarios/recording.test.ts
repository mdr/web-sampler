import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/soundsEditorPage/recordingConstants.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { launchAndStartRecordingOnEditSoundPage } from '../pageObjects/EditSoundPageObject.ts'

test('captured audio should be shown after recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)
  // wait 5 real seconds
  await editSoundPage.waitForTimeout(5000)
  await editSoundPage.pressStopButton()

  await editSoundPage.expectAudioToBeShown()
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)

  await editSoundPage.simulateVolume(25)
  await editSoundPage.expectVolumeMeterToShowLevel(25)

  await editSoundPage.simulateVolume(50)
  await editSoundPage.expectVolumeMeterToShowLevel(50)
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)

  await editSoundPage.wait(MAX_RECORDING_DURATION)

  await editSoundPage.expectAudioToBeShown()
})

test('a user can cancel selecting a source for recording', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.sidebar.pressNewSound()

  await editSoundPage.pressRecord({ primedOutcome: StartRecordingOutcome.CANCELLED_BY_USER })

  await editSoundPage.expectAudioRecorderStateToBe(AudioRecorderState.IDLE)
  await editSoundPage.expectRecordButtonToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.sidebar.pressNewSound()

  await editSoundPage.pressRecord({ primedOutcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await editSoundPage.expectToastToBeShown('No audio available in selected input')
})

test('navigating away from the page should cancel recording', async ({ mount }) => {
  const editSoundPage = await launchAndStartRecordingOnEditSoundPage(mount)
  await editSoundPage.expectAudioRecorderStateToBe(AudioRecorderState.RECORDING)

  await editSoundPage.pressHomeLink()

  await editSoundPage.expectAudioRecorderStateToBe(AudioRecorderState.IDLE)
})
