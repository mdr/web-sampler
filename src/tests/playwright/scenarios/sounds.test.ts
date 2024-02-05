import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('sounds can be created and named', async ({ mount }) => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.sidebar.pressNewSound()
  await editSoundPage.enterSoundName('Sound CCC')

  await editSoundPage.sidebar.pressNewSound()
  await editSoundPage.enterSoundName('Sound AAA')

  await editSoundPage.sidebar.pressNewSound()
  await editSoundPage.enterSoundName('Sound BBB')

  await editSoundPage.sidebar.expectSoundNamesToBe(['Sound AAA', 'Sound BBB', 'Sound CCC'])
})
