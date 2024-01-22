import { test } from '@playwright/experimental-ct-react'
import { CapturePage } from './CapturePage.tsx'
import { MountResult } from '../types.ts'

export class HomePage {
  constructor(private readonly mountResult: MountResult) {}

  clickNavbarCaptureLink = (): Promise<CapturePage> =>
    test.step('HomePage.clickNavbarCaptureLink', async () => {
      await this.mountResult.getByTestId('Navbar.capture').click()
      return CapturePage.verifyOpen(this.mountResult)
    })
}
