import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'

export class CapturePageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<CapturePageObject> => {
    await expect(mountResult.getByTestId(CapturePageTestIds.recordButton)).toBeVisible()
    return new CapturePageObject(mountResult)
  }

  private constructor(private readonly mountResult: MountResult) {}

  pressRecordButton = (): Promise<void> =>
    test.step('CapturePageObject.pressRecordButton', () =>
      this.mountResult.getByTestId(CapturePageTestIds.recordButton).click())

  pressStopButton = (): Promise<void> =>
    test.step('CapturePageObject.pressStopButton', () =>
      this.mountResult.getByTestId(CapturePageTestIds.stopButton).click())
}
