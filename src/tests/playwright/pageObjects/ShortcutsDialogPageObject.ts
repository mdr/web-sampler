import { expect } from '@playwright/experimental-ct-react'
import { Locator } from 'playwright'

import { ShortcutsDialogTestIds } from '../../../components/soundsEditor/shortcutsDialog/ShortcutsDialogTestIds.ts'
import { PageObject } from './PageObject.ts'

export class ShortcutsDialogPageObject extends PageObject {
  verifyIsShown = async (): Promise<ShortcutsDialogPageObject> =>
    this.step('verifyIsShown', async () => {
      await expect(this.get(ShortcutsDialogTestIds.dialog)).toBeVisible()
      return this
    })

  shortcutCellLocator = (): Locator => this.get(ShortcutsDialogTestIds.shortcut)
}
