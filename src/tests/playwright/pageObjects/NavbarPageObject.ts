import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { PageObject } from './PageObject.ts'
import { NavbarTestIds } from '../../../components/soundsEditor/navbar/NavbarTestIds.ts'

export class NavbarPageObject extends PageObject {
  protected readonly name = 'Navbar'

  static verifyIsShown = async (mountResult: MountResult): Promise<NavbarPageObject> => {
    await expect(mountResult.getByTestId(NavbarTestIds.homeLink)).toBeVisible()
    return new NavbarPageObject(mountResult)
  }

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  pressStorageWarningButton = (): Promise<void> =>
    this.step('pressStorageWarningButton', async () => {
      this.mountResult.getByTestId(NavbarTestIds.storageWarningButton)
      return this.press(NavbarTestIds.storageWarningButton)
    })

  expectStorageWarningDialogToBeShown = (): Promise<void> =>
    this.step('expectStorageWarningDialogToBeShown', () => this.expectToBeVisible(NavbarTestIds.storageWarningDialog))
}
