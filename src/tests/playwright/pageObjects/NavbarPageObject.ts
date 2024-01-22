import { test } from '@playwright/experimental-ct-react'
import { CapturePageObject } from './CapturePageObject.ts'
import { MountResult } from '../types.ts'
import { NavbarTestIds } from '../../../components/NavbarTestIds.ts'

export class NavbarPageObject {
  constructor(private readonly mountResult: MountResult) {}

  clickCapture = (): Promise<CapturePageObject> =>
    test.step('NavbarPageObject.clickCapture', async () => {
      await this.mountResult.getByTestId(NavbarTestIds.capture).click()
      return CapturePageObject.verifyOpen(this.mountResult)
    })
}
