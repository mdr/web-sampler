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
