import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('soundboards can be created', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard')
})
