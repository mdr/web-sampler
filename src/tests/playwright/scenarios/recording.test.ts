import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { MAX_RECORDING_DURATION } from '../../../components/soundsEditorPage/recordingConstants.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { launchAndStartRecording } from '../pageObjects/SoundsEditorPageObject.ts'

test('captured audio should be shown after recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartRecording(mount)

  await soundsEditorPage.pressStopButton()

  await soundsEditorPage.expectAudioToBeShown()
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartRecording(mount)

  await soundsEditorPage.simulateVolume(25)
  await soundsEditorPage.expectVolumeMeterToShowLevel(25)

  await soundsEditorPage.simulateVolume(50)
  await soundsEditorPage.expectVolumeMeterToShowLevel(50)
})

test('recording should stop automatically after 20 seconds', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartRecording(mount)

  await soundsEditorPage.wait(MAX_RECORDING_DURATION)

  await soundsEditorPage.expectAudioToBeShown()
})

test('a user can cancel selecting a source for recording', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()

  await soundsEditorPage.pressRecord({ primedOutcome: StartRecordingOutcome.CANCELLED_BY_USER })

  await soundsEditorPage.expectAudioRecorderStateToBe(AudioRecorderState.IDLE)
  await soundsEditorPage.expectRecordButtonToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()

  await soundsEditorPage.pressRecord({ primedOutcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await soundsEditorPage.expectToastToBeShown('No audio available in selected input')
})

test('navigating away from the page should cancel recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartRecording(mount)
  await soundsEditorPage.expectAudioRecorderStateToBe(AudioRecorderState.RECORDING)

  await soundsEditorPage.pressHomeLink()

  await soundsEditorPage.expectAudioRecorderStateToBe(AudioRecorderState.IDLE)
})