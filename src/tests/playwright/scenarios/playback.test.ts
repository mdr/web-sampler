import { test } from '@playwright/experimental-ct-react'
import { launchAndRecordNewSound } from '../pageObjects/SoundsEditorPageObject.ts'

test('start, pause and resume playback of recorded audio', async ({ mount }) => {
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

  await soundsEditorPage.pressHomeLink()

  await soundsEditorPage.expectAudioToBePlaying(false)
})
