import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { EditSoundPageTestIds } from '../../../components/editSoundPage/EditSoundPage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { VolumeMeterTestIds } from '../../../components/editSoundPage/VolumeMeter.testIds.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'

export class EditSoundPageObject extends PageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<EditSoundPageObject> => {
    await expect(mountResult.getByTestId(EditSoundPageTestIds.recordButton)).toBeVisible()
    return new EditSoundPageObject(mountResult)
  }

  pressRecordButton = ({
    outcome = StartRecordingOutcome.SUCCESS,
  }: {
    outcome?: StartRecordingOutcome
  } = {}): Promise<void> =>
    this.step('pressRecordButton', async () => {
      await this.page.evaluate((outcome) => window.testHooks.setStartRecordingOutcome(outcome), outcome)
      await this.click(EditSoundPageTestIds.recordButton)
    })

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.click(EditSoundPageTestIds.stopButton))

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
      await expect(this.mountResult.getByTestId(EditSoundPageTestIds.stopButton)).toBeVisible()
    })

  expectAudioElementToBeShown = (): Promise<void> =>
    this.step('expectAudioElementToBeShown', async () => {
      await expect(this.mountResult.getByTestId(EditSoundPageTestIds.audioElement)).toBeVisible()
    })

  expectToastToBeShown = (message: string) =>
    this.step('expectToastToBeShown', () => expect(this.mountResult.getByText(message)).toBeVisible())
}
