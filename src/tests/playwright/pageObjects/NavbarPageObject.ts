import { PageObject } from './PageObject.ts'
import { NavbarTestIds } from '../../../components/soundsEditor/navbar/NavbarTestIds.ts'
import { NavbarMenuPageObject } from './NavbarMenuPageObject.ts'
import { StorageWarningDialogPageObject } from './StorageWarningDialogPageObject.ts'
import { StorageWarningDialogTestIds } from '../../../components/soundsEditor/navbar/StorageWarningDialogTestIds.ts'

export class NavbarPageObject extends PageObject {
  protected readonly name = 'Navbar'

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  pressMenuButton = async (): Promise<NavbarMenuPageObject> => {
    await this.step('pressMenu', () => this.press(NavbarTestIds.menuButton))
    return new NavbarMenuPageObject(this.mountResult)
  }

  pressStorageWarningButton = (): Promise<StorageWarningDialogPageObject> =>
    this.step('pressStorageWarningButton', async () => {
      await this.press(NavbarTestIds.storageWarningButton)
      return await StorageWarningDialogPageObject.verifyIsShown(this.mountResult)
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
