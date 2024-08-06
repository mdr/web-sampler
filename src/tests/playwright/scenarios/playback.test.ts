import { test } from '../fixtures.ts'
import { launchAndRecordNewSound } from '../pageObjects/SoundsEditorPageObject.ts'
import { Seconds, Volume } from '../../../utils/types/brandedTypes.ts'

test('start, pause and resume playback can be controlled via the play/pause button', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)

  await soundsEditorPage.pressPlayButton()
  await soundsEditorPage.expectAudioToBePlaying(true)
  await soundsEditorPage.expectPauseButtonToBeShown()

  await soundsEditorPage.pressPauseButton()
  await soundsEditorPage.expectAudioToBePlaying(false)
  await soundsEditorPage.expectPlayButtonToBeShown()

  await soundsEditorPage.pressPlayButton()
  await soundsEditorPage.expectAudioToBePlaying(true)
  await soundsEditorPage.expectPauseButtonToBeShown()
})

test('playback can be toggled with a shortcut', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)

  await soundsEditorPage.shortcuts.togglePlayPause()
  await soundsEditorPage.expectAudioToBePlaying(true)

  await soundsEditorPage.shortcuts.togglePlayPause()
  await soundsEditorPage.expectAudioToBePlaying(false)
})

test('when playback reaches the end of the audio, stop playback', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.pressPlayButton()
  await soundsEditorPage.expectPauseButtonToBeShown()

  await soundsEditorPage.simulateAudioPlaybackComplete()

  await soundsEditorPage.expectPlayButtonToBeShown()
})

test('playback should be stopped when navigating away from the sounds editor', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.pressPlayButton()
  await soundsEditorPage.expectAudioToBePlaying(true)

  await soundsEditorPage.navbar.pressSoundboardsLink()

  await soundsEditorPage.expectAudioToBePlaying(false)
})

test('audio position can be controlled with shortcuts', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0))

  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0.5))

  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(1.0))

  await soundsEditorPage.shortcuts.seekLeft()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0.5))

  await soundsEditorPage.shortcuts.seekRightFine()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0.6))

  await soundsEditorPage.shortcuts.seekLeftFine()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0.5))

  await soundsEditorPage.shortcuts.seekLeft()
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0.0))
})

test('audio position can be controlled by clicking in the waveform', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.expectAudioPositionToBe(Seconds(0))

  await soundsEditorPage.clickCentreOfWaveform()

  await soundsEditorPage.expectAudioPositionToBe(Seconds(5), { exact: false })
})

test('volume can be controlled with the volume slider', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.expectAudioPlaybackVolumeToBe(Volume(1))

  await soundsEditorPage.moveVolumeSliderLeft(10)
  await soundsEditorPage.expectAudioPlaybackVolumeToBe(Volume(0.9))
})
