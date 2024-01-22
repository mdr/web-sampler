import { test } from '@playwright/experimental-ct-react'
import { CapturePage } from './CapturePage'
import { MountResult } from '../types'

export class HomePage {
  constructor(private readonly mountResult: MountResult) {}

  clickNavbarCaptureLink = (): Promise<CapturePage> =>
    test.step('Homepage.clickNavbarCaptureLink', async () => {
      await this.mountResult.getByTestId('Navbar.capture').click()
      return new CapturePage(this.mountResult)
    })
}
