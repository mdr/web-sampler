import { expect } from '@playwright/experimental-ct-react'
import { MountFunction, MountResult } from '../types.ts'
import { EditSoundPaneTestIds, SoundSidebarTestIds } from '../../../components/soundsEditorPage/EditSoundPaneTestIds.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/shared/NavbarTestIds.ts'
import { HomePageObject } from './HomePageObject.ts'
import { launchApp } from './launchApp.tsx'
import { SoundSidebarPageObject } from './SoundSidebarPageObject.ts'

export class SoundsEditorPageObject extends PageObject {
  static verifyIsShown = async (mountResult: MountResult): Promise<SoundsEditorPageObject> => {
    await expect(mountResult.getByTestId(SoundSidebarTestIds.newSoundButton)).toBeVisible()
    return new SoundsEditorPageObject(mountResult)
  }

  get sidebar() {
    return new SoundSidebarPageObject(this.mountResult)
  }

  enterSoundName = (name: string): Promise<void> =>
    this.step(`enterName ${name}`, () => this.get(EditSoundPaneTestIds.soundNameInput).fill(name))

  pressRecord = ({
    primedOutcome = StartRecordingOutcome.SUCCESS,
  }: Partial<{ primedOutcome: StartRecordingOutcome }> = {}): Promise<void> =>
    this.step(`pressRecordButton primedOutcome=${primedOutcome}`, async () => {
      await this.page.evaluate((outcome) => window.testHooks.primeStartRecordingOutcome(outcome), primedOutcome)
      await this.press(EditSoundPaneTestIds.recordButton)
    })

  pressStopButton = (): Promise<void> => this.step('pressStopButton', () => this.press(EditSoundPaneTestIds.stopButton))

  waitForTimeout = (duration: number): Promise<void> =>
    this.step(`waitForTimeout ${duration}`, () => this.page.waitForTimeout(duration))

  pressHomeLink = (): Promise<HomePageObject> =>
    this.step('pressHomeLink', async () => {
      await this.press(NavbarTestIds.homeLink)
      return HomePageObject.verifyIsShown(this.mountResult)
    })

  simulateVolume = (volume: number): Promise<void> =>
    this.step(`simulateVolume ${volume}`, async () => {
      await this.page.evaluate((volume) => window.testHooks.simulateVolume(volume), volume)
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
      await expect(this.get(EditSoundPaneTestIds.volumeMeter)).toHaveAttribute('data-volume', `${volume}`)
    })

  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.stopButton))

  expectRecordButtonToBeShown = (): Promise<void> =>
    this.step('expectRecordButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.recordButton))

  expectAudioToBeShown = (): Promise<void> =>
    this.step('expectAudioToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.audioElement))

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step(`expectToastToBeShown ${message}`, () => expect(this.mountResult.getByText(message)).toBeVisible())
}

export const launchAndStartRecording = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.pressRecord()
  return soundsEditorPage
}
