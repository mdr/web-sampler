import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { VolumeMeterTestIds } from '../../../components/capture/VolumeMeter.testIds.ts'

export class CapturePageObject extends PageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<CapturePageObject> => {
    await expect(mountResult.getByTestId(CapturePageTestIds.recordButton)).toBeVisible()
    return new CapturePageObject(mountResult)
  }

  pressRecordButton = (): Promise<void> =>
    this.step('pressRecordButton', () => this.click(CapturePageTestIds.recordButton))

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.click(CapturePageTestIds.stopButton))

  setVolume = (volume: number): Promise<void> =>
    this.step('setVolume', () => this.page.evaluate((volume) => window.testHooks.setVolume(volume), volume))

  waitForVolumeMeterToShowLevel = (volume: number): Promise<void> =>
    this.step('waitForVolumeMeterToShowLevel', async () => {
      await this.page.waitForSelector(`[data-testid="${VolumeMeterTestIds.bar}"][data-volume="${volume}"]`)
    })
}
