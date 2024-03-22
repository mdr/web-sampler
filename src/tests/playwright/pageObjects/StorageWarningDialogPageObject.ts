import { PageObject } from './PageObject.ts'
import { expect, MountResult } from '@playwright/experimental-ct-react'
import { StorageWarningDialogTestIds } from '../../../components/navbar/StorageWarningDialogTestIds.ts'

export class StorageWarningDialogPageObject extends PageObject {
  protected readonly name = 'StorageWarningDialog'

  static verifyIsShown = async (mountResult: MountResult): Promise<StorageWarningDialogPageObject> => {
    await expect(mountResult.page().getByTestId(StorageWarningDialogTestIds.dialog)).toBeVisible()
    return new StorageWarningDialogPageObject(mountResult)
  }

  pressAttemptToMakeStoragePersistentButton = (): Promise<void> =>
    this.step('pressAttemptToMakeStoragePersistentButton', () =>
      this.press(StorageWarningDialogTestIds.attemptToMakeStoragePersistentButton),
    )
}
