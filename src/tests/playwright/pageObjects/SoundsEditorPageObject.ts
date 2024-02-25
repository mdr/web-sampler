import { expect } from '@playwright/experimental-ct-react'
import { MountFunction, MountResult } from '../types.ts'
import { EditSoundPaneTestIds, SoundSidebarTestIds } from '../../../components/soundsEditorPage/EditSoundPaneTestIds.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/soundsEditorPage/navbar/NavbarTestIds.ts'
import { launchApp } from './launchApp.tsx'
import { SoundSidebarPageObject } from './SoundSidebarPageObject.ts'
import { platform } from 'node:os'

class SoundsEditorKeyboardShortcutsPageObject extends PageObject {
  protected readonly name = 'SoundsEditorPage.shortcuts'

  togglePlayPause = (): Promise<void> => this.step('togglePlayPause', () => this.page.keyboard.press('Space'))

  undo = (): Promise<void> =>
    this.step('undo', () => this.page.keyboard.press(platform() === 'darwin' ? 'Meta+KeyZ' : 'Control+KeyZ'))

  redo = (): Promise<void> =>
    this.step('redo', () => this.page.keyboard.press(platform() === 'darwin' ? 'Meta+Shift+KeyZ' : 'Control+KeyY'))

  seekRight = (): Promise<void> =>
    this.step('seekRight', async () => {
      await this.page.keyboard.press('ArrowRight')
      await this.clockNext()
    })

  setStartPosition = (): Promise<void> =>
    this.step('setStartPosition', async () => {
      await this.page.keyboard.press('s')
      await this.clockNext()
    })

  setFinishPosition = (): Promise<void> =>
    this.step('setFinishPosition', async () => {
      await this.page.keyboard.press('f')
      await this.clockNext()
    })
}

export class SoundsEditorPageObject extends PageObject {
  protected readonly name = 'SoundsEditorPage'

  static verifyIsShown = async (mountResult: MountResult): Promise<SoundsEditorPageObject> => {
    await expect(mountResult.getByTestId(SoundSidebarTestIds.sidebar)).toBeVisible()
    return new SoundsEditorPageObject(mountResult)
  }

  get sidebar() {
    return new SoundSidebarPageObject(this.mountResult)
  }

  get shortcuts() {
    return new SoundsEditorKeyboardShortcutsPageObject(this.mountResult)
  }

  enterSoundName = (name: string): Promise<void> =>
    this.step(`enterName ${name}`, () => this.get(EditSoundPaneTestIds.soundNameInput).fill(name))

  pressCaptureAudio = ({
    primedOutcome = StartRecordingOutcome.SUCCESS,
  }: Partial<{ primedOutcome: StartRecordingOutcome }> = {}): Promise<void> =>
    this.step(`pressCaptureAudio primedOutcome=${primedOutcome}`, async () => {
      await this.page.evaluate((outcome) => window.testHooks.primeStartRecordingOutcome(outcome), primedOutcome)
      await this.press(EditSoundPaneTestIds.captureAudioButton)
    })

  primeNoAudioOnStopRecording = (): Promise<void> =>
    this.step('primeNoAudioOnStopRecording', () =>
      this.page.evaluate(() => window.testHooks.primeNoAudioOnStopRecording()),
    )

  pressStop = (): Promise<void> => this.step('pressStop', () => this.press(EditSoundPaneTestIds.stopButton))

  pressCropAudio = (): Promise<void> =>
    this.step('pressCropAudio', () => this.press(EditSoundPaneTestIds.cropAudioButton))

  pressPlayButton = (): Promise<void> => this.step('pressPlayButton', () => this.press(EditSoundPaneTestIds.playButton))

  pressPauseButton = (): Promise<void> =>
    this.step('pressPauseButton', () => this.press(EditSoundPaneTestIds.pauseButton))

  pressDelete = (): Promise<void> => this.step('pressDelete', () => this.press(EditSoundPaneTestIds.deleteButton))

  pressDuplicateSound = (): Promise<void> =>
    this.step('pressDuplicateSound', () => this.press(EditSoundPaneTestIds.duplicateButton))

  pressHomeLink = (): Promise<void> => this.step('pressHomeLink', () => this.press(NavbarTestIds.homeLink))

  pressUndo = (): Promise<void> => this.step('pressUndo', () => this.press(NavbarTestIds.undoButton))

  pressRedo = (): Promise<void> => this.step('pressRedo', () => this.press(NavbarTestIds.redoButton))

  simulateVolume = (volume: number): Promise<void> =>
    this.step(`simulateVolume ${volume}`, async () => {
      await this.page.evaluate((volume) => window.testHooks.simulateVolume(volume), volume)
      await this.clockNext()
    })

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.step('simulateAudioPlaybackComplete', () => {
      this.page.evaluate(() => window.testHooks.simulateAudioPlaybackComplete())
    })

  getAudioRecorderState = (): Promise<AudioRecorderState> =>
    this.page.evaluate(() => window.testHooks.getAudioRecorderState())

  expectAudioRecorderStateToBe = (state: AudioRecorderState): Promise<void> =>
    this.step(`expectAudioRecorderStateToBe ${state}`, async () => {
      expect(await this.getAudioRecorderState()).toBe(state)
    })

  expectVolumeMeterToShowLevel = (volume: number): Promise<void> =>
    this.step(`expectVolumeMeterToShowLevel ${volume}`, async () => {
      await expect(this.get(EditSoundPaneTestIds.volumeMeter)).toHaveAttribute('data-volume', `${volume}`)
    })

  expectCaptureButtonToBeShown = (): Promise<void> =>
    this.step('expectCaptureButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.captureAudioButton))

  expectStopButtonToBeShown = (): Promise<void> =>
    this.step('expectStopButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.stopButton))

  expectAudioHeadingToContainText = (text: string): Promise<void> =>
    this.step(`expectAudioHeadingToContainText ${text}`, () =>
      expect(this.get(EditSoundPaneTestIds.audioHeading).getByText(text)).toBeVisible(),
    )

  expectAudioWaveformToBeShown = (): Promise<void> =>
    this.step('expectAudioWaveformToBeShown', async () => {
      await this.clockNext()
      await this.expectToBeVisible(EditSoundPaneTestIds.waveformCanvas)
    })

  expectPauseButtonToBeShown = (): Promise<void> =>
    this.step('expectPauseButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.pauseButton))

  expectPlayButtonToBeShown = (): Promise<void> =>
    this.step('expectPlayButtonToBeShown', () => this.expectToBeVisible(EditSoundPaneTestIds.playButton))
}

export const launchAndStartAudioCapture = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.sidebar.pressNewSound()
  await soundsEditorPage.pressCaptureAudio()
  return soundsEditorPage
}

export const launchAndRecordNewSound = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)
  await soundsEditorPage.pressStop()
  return soundsEditorPage
}
