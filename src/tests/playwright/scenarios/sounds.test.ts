import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('sounds can be created and named', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound CCC')

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound AAA')

  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.enterSoundName('Sound BBB')

  await soundsEditorPage.sidebar.expectSoundNamesToBe(['Sound AAA', 'Sound BBB', 'Sound CCC'])
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
