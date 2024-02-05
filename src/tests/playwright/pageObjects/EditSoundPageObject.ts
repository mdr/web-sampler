import { expect } from '@playwright/experimental-ct-react'
import { MountFunction, MountResult } from '../types.ts'
import { EditSoundPageTestIds } from '../../../components/editSoundPage/EditSoundPage.testIds.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/shared/NavbarTestIds.ts'
import { HomePageObject } from './HomePageObject.ts'
import { launchApp } from './launchApp.tsx'

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
    this.step(`pressRecordButton primedOutcome=${primedOutcome}`, async () => {
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
    this.step(`setVolume ${volume}`, async () => {
      await this.page.evaluate((volume) => window.testHooks.setVolume(volume), volume)
      await this.page.evaluate(() => window.testHooks.clockNext())
    })

  getAudioRecorderState = (): Promise<AudioRecorderState> =>
    this.page.evaluate(() => window.testHooks.getAudioRecorderState())

  expectAudioRecorderStateToBe = async (state: AudioRecorderState): Promise<void> =>
    this.step(`expectAudioRecorderStateToBe ${state}`, async () => {
      expect(await this.getAudioRecorderState()).toBe(state)
    })

  expectVolumeMeterToShowLevel = (volume: number): Promise<void> =>
    this.step(`expectVolumeMeterToShowLevel ${volume}`, async () => {
      await expect(this.get(EditSoundPageTestIds.volumeMeter)).toHaveAttribute('data-volume', `${volume}`)
    })

  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', () => this.expectToBeVisible(EditSoundPageTestIds.stopButton))

  expectAudioToBeShown = (): Promise<void> =>
    this.step('expectAudioToBeShown', () => this.expectToBeVisible(EditSoundPageTestIds.audioElement))

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step(`expectToastToBeShown ${message}`, () => expect(this.mountResult.getByText(message)).toBeVisible())
}

export const launchAndStartRecordingOnEditSoundPage = async (mount: MountFunction): Promise<EditSoundPageObject> => {
  const homePage = await launchApp(mount)
  const editSoundPage = await homePage.pressNewSound()
  await editSoundPage.pressRecord()
  return editSoundPage
}
