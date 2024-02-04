import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { EditSoundPageTestIds } from '../../../components/editSoundPage/EditSoundPage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { StartRecordingOutcome } from '../../../audio/IAudioRecorder.ts'

export class EditSoundPageObject extends PageObject {
  static verifyOpen = async (mountResult: MountResult): Promise<EditSoundPageObject> => {
    await expect(mountResult.getByTestId(EditSoundPageTestIds.recordButton)).toBeVisible()
    return new EditSoundPageObject(mountResult)
  }

  pressRecordButton = ({
    primedOutcome = StartRecordingOutcome.SUCCESS,
  }: {
    primedOutcome?: StartRecordingOutcome
  } = {}): Promise<void> =>
    this.step('pressRecordButton', async () => {
      await this.page.evaluate((outcome) => window.testHooks.setStartRecordingOutcome(outcome), primedOutcome)
      await this.click(EditSoundPageTestIds.recordButton)
    })

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.click(EditSoundPageTestIds.stopButton))

  setVolume = (volume: number): Promise<void> =>
    this.step('setVolume', async () => {
      await this.page.evaluate((volume) => window.testHooks.setVolume(volume), volume)
      await this.page.evaluate(() => window.testHooks.clockNext())
    })

  expectVolumeMeterToShowLevel = (volume: number): Promise<void> =>
    this.step('expectVolumeMeterToShowLevel', async () => {
      await expect(this.get(EditSoundPageTestIds.volumeMeter)).toHaveAttribute('data-volume', `${volume}`)
    })

  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', () => this.expectToBeVisible(EditSoundPageTestIds.stopButton))

  expectAudioElementToBeShown = (): Promise<void> =>
    this.step('expectAudioElementToBeShown', () => this.expectToBeVisible(EditSoundPageTestIds.audioElement))

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step('expectToastToBeShown', () => expect(this.mountResult.getByText(message)).toBeVisible())
}
