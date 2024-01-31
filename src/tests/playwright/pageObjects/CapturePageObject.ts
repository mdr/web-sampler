import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { VolumeMeterTestIds } from '../../../components/capture/VolumeMeter.testIds.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'

export class CapturePageObject extends PageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<CapturePageObject> => {
    await expect(mountResult.getByTestId(CapturePageTestIds.recordButton)).toBeVisible()
    return new CapturePageObject(mountResult)
  }

  pressRecordButton = ({
    outcome = StartRecordingOutcome.SUCCESS,
  }: {
    outcome?: StartRecordingOutcome
  } = {}): Promise<void> =>
    this.step('pressRecordButton', async () => {
      await this.page.evaluate((outcome) => window.testHooks.setStartRecordingOutcome(outcome), outcome)
      await this.click(CapturePageTestIds.recordButton)
    })

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.click(CapturePageTestIds.stopButton))

  setVolume = (volume: number): Promise<void> =>
    this.step('setVolume', async () => {
      await this.page.evaluate((volume) => window.testHooks.setVolume(volume), volume)
      await this.page.evaluate(() => window.testHooks.clockNext())
    })

  expectVolumeMeterToShowLevel = (volume: number): Promise<void> =>
    this.step('waitForVolumeMeterToShowLevel', async () => {
      await expect(this.mountResult.getByTestId(VolumeMeterTestIds.bar)).toHaveAttribute('data-volume', `${volume}`)
    })
  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', async () => {
      await expect(this.mountResult.getByTestId(CapturePageTestIds.stopButton)).toBeVisible()
    })

  expectAudioElementToBeShown = (): Promise<void> =>
    this.step('expectAudioElementToBeShown', async () => {
      await expect(this.mountResult.getByTestId(CapturePageTestIds.audioElement)).toBeVisible()
    })

  expectToastToBeShown = (message: string) =>
    this.step('expectToastToBeShown', () => expect(this.mountResult.getByText(message)).toBeVisible())
}
