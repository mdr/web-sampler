import { expect } from '@playwright/experimental-ct-react'

import { EditImagePaneTestIds } from '../../../components/images/editImagePane/EditImagePaneTestIds.ts'
import { ImagesSidebarTestIds } from '../../../components/images/sidebar/ImagesSidebarTestIds.ts'
import { Path } from '../../../utils/types/brandedTypes.ts'
import { ImagesSidebarPageObject } from './ImagesSidebarPageObject.ts'
import { PageObject } from './PageObject.ts'

export class ImagesEditorPageObject extends PageObject {
  protected readonly name = 'ImagesEditor'

  verifyIsShown = async (): Promise<ImagesEditorPageObject> =>
    this.step(`verifyIsShown`, async () => {
      await expect(this.get(ImagesSidebarTestIds.sidebar)).toBeVisible()
      return this
    })

  get sidebar(): ImagesSidebarPageObject {
    return new ImagesSidebarPageObject(this.mountResult)
  }

  enterImageName = (name: string): Promise<void> =>
    this.step(`enterImageName ${name}`, async () => {
      await this.get(EditImagePaneTestIds.imageNameInput).click()
      await this.get(EditImagePaneTestIds.imageNameInput).fill(name)
      await this.page.keyboard.press('Enter')
    })

  pressDelete = async (): Promise<ImagesEditorPageObject> => {
    await this.step('pressDelete', () => this.press(EditImagePaneTestIds.deleteButton))
    return await new ImagesEditorPageObject(this.mountResult).verifyIsShown()
  }

  clickImageUploadZoneAndChooseFile = (path: Path): Promise<void> =>
    this.step('clickImageUploadZone', () => this.clickAndUploadFile(EditImagePaneTestIds.dropzone, path))

  expectImageToBeShown = (): Promise<void> =>
    this.step('expectImageToBeShown', () => this.expectToBeVisible(EditImagePaneTestIds.image))

  expectImageNotToBeShown = (): Promise<void> =>
    this.step('expectImageNotToBeShown', () => this.expectToBeHidden(EditImagePaneTestIds.image))
}
