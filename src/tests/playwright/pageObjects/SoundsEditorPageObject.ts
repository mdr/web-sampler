import { expect } from '@playwright/experimental-ct-react'
import { MountFunction, MountResult } from '../types.ts'
import { EditSoundPaneTestIds, SoundSidebarTestIds } from '../../../components/soundsEditorPage/EditSoundPaneTestIds.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/shared/NavbarTestIds.ts'
import { launchApp } from './launchApp.tsx'
import { SoundSidebarPageObject } from './SoundSidebarPageObject.ts'

export class SoundsEditorPageObject extends PageObject {
  protected readonly name = 'SoundsEditorPage'

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
    this.step(`pressRecord primedOutcome=${primedOutcome}`, async () => {
      await this.page.evaluate((outcome) => window.testHooks.primeStartRecordingOutcome(outcome), primedOutcome)
      await this.press(EditSoundPaneTestIds.recordButton)
    })

  primeNoAudioOnStopRecording = (): Promise<void> =>
    this.step('primeNoAudioOnStopRecording', () =>
      this.page.evaluate(() => window.testHooks.primeNoAudioOnStopRecording()),
    )

  pressStop = (): Promise<void> => this.step('pressStop', () => this.press(EditSoundPaneTestIds.stopButton))

  pressPlayButton = (): Promise<void> => this.step('pressPlayButton', () => this.press(EditSoundPaneTestIds.playButton))

  pressPauseButton = (): Promise<void> =>
    this.step('pressPauseButton', () => this.press(EditSoundPaneTestIds.pauseButton))

  pressDelete = (): Promise<void> => this.step('pressDelete', () => this.press(EditSoundPaneTestIds.deleteButton))

  pressHomeLink = (): Promise<void> => this.step('pressHomeLink', () => this.press(NavbarTestIds.homeLink))

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  simulateVolume = (volume: number): Promise<void> =>
    this.step(`simulateVolume ${volume}`, async () => {
      await this.page.evaluate((volume) => window.testHooks.simulateVolume(volume), volume)
      await this.page.evaluate(() => window.testHooks.clockNext())
    })

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.step('simulateAudioPlaybackComplete', () => {
      this.page.evaluate(() => window.testHooks.simulateAudioPlaybackComplete())
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

  expectRecordButtonToBeShown = (): Promise<void> =>
    this.step('expectRecordButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.recordButton))

  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.stopButton))

  expectAudioWaveformToBeShown = (): Promise<void> =>
    this.step('expectAudioWaveformToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.waveformCanvas))

  expectPauseButtonToBeShown = (): Promise<void> =>
    this.step('expectPauseButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.pauseButton))

  expectPlayButtonToBeShown = (): Promise<void> =>
    this.step('expectPlayButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.playButton))
}

export const launchAndStartRecording = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.pressRecord()
  return soundsEditorPage
}

export const launchAndRecordNewSound = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchAndStartRecording(mount)
  await soundsEditorPage.pressStop()
  return soundsEditorPage
}
