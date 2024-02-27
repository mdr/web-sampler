import { expect, test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { launchAndRecordNewSound, launchAndStartAudioCapture } from '../pageObjects/SoundsEditorPageObject.ts'
import { getTotalAudioDuration } from '../../../types/SoundAudio.ts'
import { assertSoundHasAudio, filesAreEqual } from '../testUtils.ts'

export const EXPECTED_DOWNLOAD_PATH = 'src/tests/playwright/data/expected-download.wav'
test('sounds can be created and named', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound 11')

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound 9')

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('sound 10')

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound 9', 'sound 10', 'Sound 11'])
})

test('a sound without a name is displayed as "Untitled Sound"', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)

  await soundsEditorPage.sidebar.pressNewSound()

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])
})

test('sounds can be renamed', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound AAA')
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound BBB')
  await soundsEditorPage.sidebar.pickSound('Sound AAA')

  await soundsEditorPage.enterSoundName('Sound CCC')

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound BBB', 'Sound CCC'])
})

test('sounds can be deleted', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound AAA')
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound BBB')

  await soundsEditorPage.pressDelete()

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound AAA'])
  await soundsEditorPage.expectToastToBeShown('Deleted sound Sound BBB')
})

test('sounds can be duplicated', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound AAA')

  await soundsEditorPage.pressDuplicateSound()
  await soundsEditorPage.pressDuplicateSound()

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound AAA', 'Sound AAA', 'Sound AAA'])
})

test('undo/redo should handle sound creation and name editing', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])

  await soundsEditorPage.navbar.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.navbar.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  await soundsEditorPage.navbar.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.navbar.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])
})

test('undo/redo should handle sound deletion', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.pressDelete()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  await soundsEditorPage.navbar.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])

  await soundsEditorPage.navbar.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])
})

test('keyboard shortcuts should work for undo/redo', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')

  await soundsEditorPage.shortcuts.undo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.shortcuts.redo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])
})

test('adjusting the start and finish times of a sound via keyboard shortcuts', async ({ mount }) => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)
  await soundsEditorPage.pressStop()
  await soundsEditorPage.expectAudioWaveformToBeShown()
  await soundsEditorPage.expectAudioHeadingToContainText('10 seconds')

  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.shortcuts.setStartPosition()
  await soundsEditorPage.expectAudioHeadingToContainText('9.5 seconds')

  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.shortcuts.setFinishPosition()
  await soundsEditorPage.expectAudioHeadingToContainText('0.5 seconds')

  await soundsEditorPage.checkScreenshot('constrained-audio')
})

test('cropping a sound should modify the audio', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.shortcuts.setStartPosition()
  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.shortcuts.setFinishPosition()
  const [initialSound] = await soundsEditorPage.getSounds()
  assertSoundHasAudio(initialSound)
  expect(getTotalAudioDuration(initialSound.audio)).toBe(10)
  expect(initialSound.audio.startTime).toBe(0.5)
  expect(initialSound.audio.finishTime).toBe(1)

  await soundsEditorPage.pressCropAudio()

  const [croppedSound] = await soundsEditorPage.getSounds()
  assertSoundHasAudio(croppedSound)
  expect(getTotalAudioDuration(croppedSound.audio)).toBe(0.5)
  expect(croppedSound.audio.startTime).toBe(0)
  expect(croppedSound.audio.finishTime).toBe(0.5)
})

test('can download a sound as a Wav file', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)

  const downloadedWavPath = await soundsEditorPage.pressDownloadWav()

  expect(
    await filesAreEqual(downloadedWavPath, EXPECTED_DOWNLOAD_PATH),
    'downloaded Wav file should have the correct contents',
  ).toBe(true)
})

test('storage warning button should open a modal', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)

  await soundsEditorPage.navbar.pressStorageWarningButton()

  await soundsEditorPage.navbar.expectStorageWarningDialogToBeShown()
  await soundsEditorPage.checkScreenshot('storage-warning-dialog')
})

test.skip('can export and import sounds', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.enterSoundName('Sound 1')
  const menu = await soundsEditorPage.navbar.pressMenuButton()
  const exportedSoundsPath = await menu.pressExportAllSounds()

  await soundsEditorPage.pressDelete()
  await menu.pressImportSounds(exportedSoundsPath)

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound 1'])
})
