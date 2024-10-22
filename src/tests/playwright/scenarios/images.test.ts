import { test } from '../fixtures.ts'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('images can be created and named', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const imagesEditorPage = await soundsEditorPage.navbar.pressImagesLink()

  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 11')

  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 9')

  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 10')

  await imagesEditorPage.sidebar.expectImageNamesToBe(['Image 9', 'Image 10', 'Image 11'])
})
