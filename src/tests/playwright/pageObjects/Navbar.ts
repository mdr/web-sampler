import { test } from '@playwright/experimental-ct-react'
import { CapturePage } from './CapturePage.ts'
import { MountResult } from '../types.ts'
import { NavbarTestIds } from '../../../components/NavbarTestIds.ts'

export class Navbar {
  constructor(private readonly mountResult: MountResult) {}

  clickCapture = (): Promise<CapturePage> =>
    test.step('Navbar.clickCapture', async () => {
      await this.mountResult.getByTestId(NavbarTestIds.capture).click()
      return CapturePage.verifyOpen(this.mountResult)
    })
}
