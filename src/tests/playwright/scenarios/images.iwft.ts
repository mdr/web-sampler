import { TEST_IMAGE_FILE } from '../data/testFiles.testSupport.ts'
import { test } from '../fixtures.ts'

test('images can be created and named', async ({ imagesEditorPage }) => {
  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 11')

  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 9')

  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.enterImageName('Image 10')

  await imagesEditorPage.sidebar.expectImageNamesToBe(['Image 9', 'Image 10', 'Image 11'])
})

test('images can be deleted', async ({ imagesEditorPage }) => {
  await imagesEditorPage.sidebar.pressNewImage()

  await imagesEditorPage.pressDelete()

  await imagesEditorPage.expectToastToBeShown('Deleted image Untitled Image')
  await imagesEditorPage.sidebar.expectImageNamesToBe([])
})

test('images can be uploaded', async ({ imagesEditorPage }) => {
  await imagesEditorPage.sidebar.pressNewImage()
  await imagesEditorPage.expectImageNotToBeShown()

  await imagesEditorPage.clickImageUploadZoneAndChooseFile(TEST_IMAGE_FILE)

  await imagesEditorPage.expectImageToBeShown()
})
