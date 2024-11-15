import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { MAX_RECORDING_DURATION } from '../../../components/soundsEditor/recordingConstants.ts'
import { Volume } from '../../../utils/types/brandedTypes.ts'
import { test } from '../fixtures.ts'
import { launchAndStartAudioCapture } from '../pageObjects/SoundsEditorPageObject.ts'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('captured audio should be shown after recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)

  await soundsEditorPage.pressStop()

  await soundsEditorPage.expectAudioWaveformToBeShown()
  await soundsEditorPage.checkScreenshot('captured-audio')
})

test('a volume meter should indicate audio level during recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)

  await soundsEditorPage.simulateAudioRecordingVolume(Volume(0.25))
  await soundsEditorPage.expectVolumeMeterToShowLevel(Volume(0.25))

  await soundsEditorPage.checkScreenshot('capturing-audio')

  await soundsEditorPage.simulateAudioRecordingVolume(Volume(0.5))
  await soundsEditorPage.expectVolumeMeterToShowLevel(Volume(0.5))
})

test('audio capture should stop automatically after the maximum recording duration', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount, { useFakeTimers: true })

  await soundsEditorPage.wait(MAX_RECORDING_DURATION)

  await soundsEditorPage.expectAudioWaveformToBeShown()
})

test('a user can cancel selecting a source for recording', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()

  await soundsEditorPage.pressCaptureAudio({ primedOutcome: StartRecordingOutcome.CANCELLED_BY_USER })

  await soundsEditorPage.expectAudioRecorderStatusToBe(AudioRecorderStatus.IDLE)
  await soundsEditorPage.expectCaptureButtonToBeShown()
})

test('an error toast should be shown if no audio is available on the selected source', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()

  await soundsEditorPage.pressCaptureAudio({ primedOutcome: StartRecordingOutcome.NO_AUDIO_TRACK })

  await soundsEditorPage.expectToastToBeShown('No audio available in selected input')
})

test('navigating away from the page should cancel recording', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)
  await soundsEditorPage.expectAudioRecorderStatusToBe(AudioRecorderStatus.RECORDING)

  await soundsEditorPage.navbar.pressSoundboardsLink()

  await soundsEditorPage.expectAudioRecorderStatusToBe(AudioRecorderStatus.IDLE)
})

test('a toast should be shown if no audio was captured', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.pressCaptureAudio()
  await soundsEditorPage.primeNoAudioOnStopRecording()

  await soundsEditorPage.pressStop()

  await soundsEditorPage.expectToastToBeShown('No audio captured')
})
