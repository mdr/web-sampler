import { MountResult, expect } from '@playwright/experimental-ct-react'

import { EditImagePaneTestIds } from '../../../components/images/editImagePane/EditImagePaneTestIds.ts'
import { ImagesSidebarTestIds } from '../../../components/images/sidebar/ImagesSidebarTestIds.ts'
import { Path } from '../../../utils/types/brandedTypes.ts'
import { ImagesSidebarPageObject } from './ImagesSidebarPageObject.ts'
import { NavbarPageObject } from './NavbarPageObject.ts'
import { PageObject } from './PageObject.ts'

export class ImagesEditorPageObject extends PageObject {
  protected readonly name = 'ImagesEditor'

  static verifyIsShown = async (mountResult: MountResult): Promise<ImagesEditorPageObject> => {
    await expect(mountResult.getByTestId(ImagesSidebarTestIds.sidebar)).toBeVisible()
    return new ImagesEditorPageObject(mountResult)
  }

  get sidebar(): ImagesSidebarPageObject {
    return new ImagesSidebarPageObject(this.mountResult)
  }

  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }

  enterImageName = (name: string): Promise<void> =>
    this.step(`enterImageName ${name}`, async () => {
      await this.get(EditImagePaneTestIds.imageNameInput).click()
      await this.get(EditImagePaneTestIds.imageNameInput).fill(name)
      await this.page.keyboard.press('Enter')
    })

  pressDelete = async (): Promise<ImagesEditorPageObject> => {
    await this.step('pressDelete', () => this.press(EditImagePaneTestIds.deleteButton))
    return await ImagesEditorPageObject.verifyIsShown(this.mountResult)
  }

  clickImageUploadZoneAndChooseFile = (path: Path): Promise<void> =>
    this.step('clickImageUploadZone', () => this.clickAndUploadFile(EditImagePaneTestIds.dropzone, path))

  expectImageToBeShown = (): Promise<void> =>
    this.step('expectImageToBeShown', () => this.expectToBeVisible(EditImagePaneTestIds.image))

  expectImageNotToBeShown = (): Promise<void> =>
    this.step('expectImageNotToBeShown', () => this.expectToBeHidden(EditImagePaneTestIds.image))
}
