import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'

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

test('undo/redo should handle sound creation and name editing', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])

  await soundsEditorPage.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  await soundsEditorPage.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])
})

test('undo/redo should handle sound deletion', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')
  await soundsEditorPage.pressDelete()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])

  await soundsEditorPage.pressUndo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])

  await soundsEditorPage.pressRedo()
  await soundsEditorPage.sidebar.expectSoundNamesToBe([])
})

test('keyboard shortcuts should work for undo/redo', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('A')

  await soundsEditorPage.undoWithKeyboardShortcut()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Untitled Sound'])

  await soundsEditorPage.redoWithKeyboardShortcut()
  await soundsEditorPage.sidebar.expectSoundNamesToBe(['A'])
})
