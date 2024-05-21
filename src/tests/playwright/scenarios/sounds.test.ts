import { expect, test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import {
  launchAndCreateNewSound,
  launchAndRecordNewSound,
  launchAndStartAudioCapture,
} from '../pageObjects/SoundsEditorPageObject.ts'
import { getFinishTime, getStartTime, getTotalAudioDuration } from '../../../types/SoundAudio.ts'
import { assertSoundHasAudio, filesAreEqual } from '../testUtils.ts'
import { Seconds } from '../../../utils/types/brandedTypes.ts'
import { MAX_RECORDING_DURATION } from '../../../components/soundsEditor/recordingConstants.ts'
import {
  EXPECTED_MP3_DOWNLOAD_PATH,
  EXPECTED_WAV_DOWNLOAD_PATH,
  INVALID_AUDIO_FILE,
  LONG_AUDIO_FILE,
  TEST_AUDIO_FILE,
} from '../data/testFiles.testSupport.ts'

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
  const soundsEditorPage = await launchAndCreateNewSound(mount)
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.pressDelete()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  await soundsEditorPage.navbar.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])

  await soundsEditorPage.navbar.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])
})

test('keyboard shortcuts should work for undo/redo', async ({ mount }) => {
  const soundsEditorPage = await launchAndCreateNewSound(mount)
  await soundsEditorPage.enterSoundName('A')

  await soundsEditorPage.shortcuts.undo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.shortcuts.redo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])
})

test('undo shortcut should suppress browser undo behavior', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.shortcuts.seekRight()
  await soundsEditorPage.shortcuts.setStartPosition()

  await soundsEditorPage.shortcuts.undo()

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
  expect(getTotalAudioDuration(initialSound.audio)).toBe(Seconds(10))

  expect(getStartTime(initialSound.audio)).toBe(Seconds(0.5))
  expect(getFinishTime(initialSound.audio)).toBe(Seconds(1))

  await soundsEditorPage.pressCropAudio()

  const [croppedSound] = await soundsEditorPage.getSounds()
  assertSoundHasAudio(croppedSound)
  expect(getTotalAudioDuration(croppedSound.audio)).toBe(Seconds(0.5))
  expect(getStartTime(croppedSound.audio)).toBe(Seconds(0))
  expect(getFinishTime(croppedSound.audio)).toBe(Seconds(0.5))
})

test('can download a sound as a WAV file', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)

  const downloadedFilePath = await soundsEditorPage.pressDownloadWav()

  expect(
    await filesAreEqual(downloadedFilePath, EXPECTED_WAV_DOWNLOAD_PATH),
    'downloaded WAV file should have the correct contents',
  ).toBe(true)
})

test('can download a sound as an MP3 file', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)

  const downloadedFilePath = await soundsEditorPage.pressDownloadMp3()

  expect(
    await filesAreEqual(downloadedFilePath, EXPECTED_MP3_DOWNLOAD_PATH),
    'downloaded MP3 file should have the correct contents',
  ).toBe(true)
})

test('can upload audio from an audio file', async ({ mount }) => {
  const soundsEditorPage = await launchAndCreateNewSound(mount)

  await soundsEditorPage.pressImportAudioButton(TEST_AUDIO_FILE)

  await soundsEditorPage.expectAudioWaveformToBeShown()
  const [sound] = await soundsEditorPage.getSounds()
  assertSoundHasAudio(sound)
  expect(getTotalAudioDuration(sound.audio)).toBeCloseTo(Seconds(7), 0)
})

test('handling of invalid audio file', async ({ mount }) => {
  const soundsEditorPage = await launchAndCreateNewSound(mount)

  await soundsEditorPage.pressImportAudioButton(INVALID_AUDIO_FILE)

  await soundsEditorPage.expectToastToBeShown('Error importing audio.')
})

test('truncation of a long imported audio file', async ({ mount }) => {
  const soundsEditorPage = await launchAndCreateNewSound(mount)

  await soundsEditorPage.pressImportAudioButton(LONG_AUDIO_FILE)

  await soundsEditorPage.expectToastToBeShown(`Audio was truncated to ${MAX_RECORDING_DURATION} seconds.`)
  const [sound] = await soundsEditorPage.getSounds()
  assertSoundHasAudio(sound)
  expect(getTotalAudioDuration(sound.audio)).toBe(Seconds(30))
})

test('can export and import sounds', async ({ mount }) => {
  const soundsEditorPage = await launchAndRecordNewSound(mount)
  await soundsEditorPage.enterSoundName('Sound 1')

  let menu = await soundsEditorPage.navbar.pressMenuButton()
  const exportedSoundsPath = await menu.pressExportAllSounds()

  await soundsEditorPage.pressDelete()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  menu = await soundsEditorPage.navbar.pressMenuButton()
  await menu.pressImportSounds(exportedSoundsPath)

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound 1'])
})

test.skip('display of shortcuts dialog', async ({ mount }) => {
  const soundsEditorPage = await launchAndCreateNewSound(mount)

  await soundsEditorPage.pressShortcutsButton()

  await soundsEditorPage.checkScreenshot('shortcuts-dialog')
})
