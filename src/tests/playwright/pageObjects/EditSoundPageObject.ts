import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { EditSoundPageTestIds } from '../../../components/editSoundPage/EditSoundPage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/shared/NavbarTestIds.ts'
import { HomePageObject } from './HomePageObject.ts'

export class EditSoundPageObject extends PageObject {
  static verifyIsShown = async (mountResult: MountResult): Promise<EditSoundPageObject> => {
    await expect(mountResult.getByTestId(EditSoundPageTestIds.recordButton)).toBeVisible()
    return new EditSoundPageObject(mountResult)
  }

  pressRecord = ({
    primedOutcome = StartRecordingOutcome.SUCCESS,
  }: {
    primedOutcome?: StartRecordingOutcome
  } = {}): Promise<void> =>
    this.step('pressRecordButton', async () => {
      await this.page.evaluate((outcome) => window.testHooks.setStartRecordingOutcome(outcome), primedOutcome)
      await this.press(EditSoundPageTestIds.recordButton)
    })

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.press(EditSoundPageTestIds.stopButton))

  pressHomeLink = (): Promise<HomePageObject> =>
    this.step('pressHomeLink', async () => {
      await this.press(NavbarTestIds.homeLink)
      return HomePageObject.verifyIsShown(this.mountResult)
    })

  setVolume = (volume: number): Promise<void> =>
    this.step('setVolume', async () => {
      await this.page.evaluate((volume) => window.testHooks.setVolume(volume), volume)
      await this.page.evaluate(() => window.testHooks.clockNext())
    })

  getAudioRecorderState = (): Promise<AudioRecorderState> =>
    this.page.evaluate(() => window.testHooks.getAudioRecorderState())

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
