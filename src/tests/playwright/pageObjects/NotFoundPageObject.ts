import { expect } from '@playwright/experimental-ct-react'

import { MiscTestIds } from '../../../components/misc/MiscTestIds.ts'
import { PageObject } from './PageObject.ts'

export class NotFoundPageObject extends PageObject {
  verifyIsShown = async (): Promise<NotFoundPageObject> => {
    await expect(this.get(MiscTestIds.notFoundPage)).toBeVisible()
    return this
  }
}
