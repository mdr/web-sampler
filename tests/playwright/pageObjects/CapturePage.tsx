import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types'

export class CapturePage {
  constructor(private readonly mountResult: MountResult) {}

  pressRecordButton = (): Promise<void> =>
    test.step('CapturePage.pressRecordButton', async () => {
      await this.mountResult.getByTestId('CapturePageTestIds.recordButton').click()
    })

  expectContainsText = async (text: string): Promise<void> => {
    await expect(this.mountResult).toContainText(text)
  }
}
