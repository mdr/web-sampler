import { test } from '@playwright/experimental-ct-react'
import { launchAndStartRecording } from '../pageObjects/SoundsEditorPageObject.ts'

test('it should be possible to start and pause playback of recorded audio', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartRecording(mount)
  await soundsEditorPage.pressStop()
  await soundsEditorPage.expectAudioWaveformToBeShown()

  await soundsEditorPage.pressPlayButton()
  await soundsEditorPage.expectPauseButtonToBeShown()

  await soundsEditorPage.pressPauseButton()
  await soundsEditorPage.expectPlayButtonToBeShown()
})
