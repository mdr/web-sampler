import { PageObject } from './PageObject.ts'
import { NavbarTestIds } from '../../../components/soundsEditor/navbar/NavbarTestIds.ts'

export class NavbarPageObject extends PageObject {
  protected readonly name = 'Navbar'

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  pressStorageWarningButton = (): Promise<void> =>
    this.step('pressStorageWarningButton', () => this.press(NavbarTestIds.storageWarningButton))

  expectStorageWarningDialogToBeShown = (): Promise<void> =>
    this.step('expectStorageWarningDialogToBeShown', () => this.expectToBeVisible(NavbarTestIds.storageWarningDialog))
}
