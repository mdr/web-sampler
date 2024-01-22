import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'

export class CapturePage {
  static verifyOpen = async (mountResult: MountResult): Promise<CapturePage> => {
    await expect(mountResult.getByTestId(CapturePageTestIds.recordButton)).toBeVisible()
    return new CapturePage(mountResult)
  }

  private constructor(private readonly mountResult: MountResult) {}

  pressRecordButton = (): Promise<void> =>
    test.step('CapturePage.pressRecordButton', () =>
      this.mountResult.getByTestId(CapturePageTestIds.recordButton).click())

  expectContainsText = (text: string): Promise<void> => expect(this.mountResult).toContainText(text)
}
