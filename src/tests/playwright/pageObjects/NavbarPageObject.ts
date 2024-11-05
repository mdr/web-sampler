import { NavbarTestIds } from '../../../components/navbar/NavbarTestIds.ts'
import { StorageWarningDialogTestIds } from '../../../components/navbar/StorageWarningDialogTestIds.ts'
import { ImagesEditorPageObject } from './ImagesEditorPageObject.ts'
import { NavbarMenuPageObject } from './NavbarMenuPageObject.ts'
import { PageObject } from './PageObject.ts'
import { SoundboardsEditorPageObject } from './SoundboardsEditorPageObject.ts'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'
import { StorageWarningDialogPageObject } from './StorageWarningDialogPageObject.ts'

export class NavbarPageObject extends PageObject {
  protected readonly name = 'Navbar'

  pressSoundboardsLink = (): Promise<SoundboardsEditorPageObject> =>
    this.step('pressSoundboardsLink', async () => {
      await this.press(NavbarTestIds.soundboardsLink)
      return new SoundboardsEditorPageObject(this.mountResult).verifyIsShown()
    })

  pressImagesLink = (): Promise<ImagesEditorPageObject> =>
    this.step('pressImagesLink', async () => {
      await this.press(NavbarTestIds.imagesLink)
      return new ImagesEditorPageObject(this.mountResult).verifyIsShown()
    })

  pressHomeLink = (): Promise<SoundsEditorPageObject> =>
    this.step('pressHomeLink', async () => {
      await this.press(NavbarTestIds.homeLink)
      return new SoundsEditorPageObject(this.mountResult).verifyIsShown()
    })

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  pressMenuButton = async (): Promise<NavbarMenuPageObject> => {
    await this.step('pressMenu', () => this.press(NavbarTestIds.menuButton))
    return new NavbarMenuPageObject(this.mountResult)
  }

  pressStorageWarningButton = (): Promise<StorageWarningDialogPageObject> =>
    this.step('pressStorageWarningButton', async () => {
      await this.press(NavbarTestIds.storageWarningButton)
      return await new StorageWarningDialogPageObject(this.mountResult).verifyIsShown()
    })

  expectStorageWarningButtonToBeShown = (): Promise<void> =>
    this.step('expectStorageWarningButtonToBeShown', () => this.expectToBeVisible(NavbarTestIds.storageWarningButton))

  expectStorageWarningButtonToNotBeShown = (): Promise<void> =>
    this.step('expectStorageWarningButtonToNotBeShown', () => this.expectToBeHidden(NavbarTestIds.storageWarningButton))

  expectStorageWarningDialogToBeShown = (): Promise<void> =>
    this.step('expectStorageWarningDialogToBeShown', () => this.expectToBeVisible(StorageWarningDialogTestIds.dialog))

  expectStorageWarningDialogToNotBeShown = (): Promise<void> =>
    this.step('expectStorageWarningDialogToNotBeShown', () => this.expectToBeHidden(StorageWarningDialogTestIds.dialog))
}
