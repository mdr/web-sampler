import { MountResult, expect } from '@playwright/experimental-ct-react'

import { EditImagePaneTestIds } from '../../../components/images/editImagePane/EditImagePaneTestIds.ts'
import { ImagesSidebarTestIds } from '../../../components/images/sidebar/ImagesSidebarTestIds.ts'
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
}
