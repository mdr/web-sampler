import { MountResult, expect } from '@playwright/experimental-ct-react'

import { MiscTestIds } from '../../../components/misc/MiscTestIds.ts'
import { PageObject } from './PageObject.ts'

export class NotFoundPageObject extends PageObject {
  protected readonly name = 'NotFoundPage'

  static verifyIsShown = async (mountResult: MountResult): Promise<NotFoundPageObject> => {
    await expect(mountResult.page().getByTestId(MiscTestIds.notFoundPage)).toBeVisible()
    return new NotFoundPageObject(mountResult)
  }
}
