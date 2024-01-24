import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'
import { PageObject } from './PageObject.ts'

export class CapturePageObject extends PageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<CapturePageObject> => {
    await expect(mountResult.getByTestId(CapturePageTestIds.recordButton)).toBeVisible()
    return new CapturePageObject(mountResult)
  }

  pressRecordButton = (): Promise<void> =>
    this.step('pressRecordButton', () => this.click(CapturePageTestIds.recordButton))

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.click(CapturePageTestIds.stopButton))
}
