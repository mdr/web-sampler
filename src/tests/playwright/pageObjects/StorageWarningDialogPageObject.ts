import { expect } from '@playwright/experimental-ct-react'

import { StorageWarningDialogTestIds } from '../../../components/navbar/StorageWarningDialogTestIds.ts'
import { PageObject } from './PageObject.ts'

export class StorageWarningDialogPageObject extends PageObject {
  verifyIsShown = async (): Promise<StorageWarningDialogPageObject> =>
    this.step(`verifyIsShown`, async () => {
      await expect(this.get(StorageWarningDialogTestIds.dialog)).toBeVisible()
      return this
    })

  pressAttemptToMakeStoragePersistentButton = (): Promise<void> =>
    this.step('pressAttemptToMakeStoragePersistentButton', () =>
      this.press(StorageWarningDialogTestIds.attemptToMakeStoragePersistentButton),
    )
}
