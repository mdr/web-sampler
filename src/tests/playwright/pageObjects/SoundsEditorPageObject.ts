import { expect, MountResult } from '@playwright/experimental-ct-react'
import { MountFunction } from '../types.ts'
import { PageObject } from './PageObject.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { NavbarTestIds } from '../../../components/navbar/NavbarTestIds.ts'
import { launchApp } from './launchApp.tsx'
import { SoundSidebarPageObject } from './SoundSidebarPageObject.ts'
import { platform } from 'node:os'
import { NavbarPageObject } from './NavbarPageObject.ts'
import { SoundSidebarTestIds } from '../../../components/soundsEditor/sidebar/SoundSidebarTestIds.ts'
import { EditSoundPaneTestIds } from '../../../components/soundsEditor/editSoundPane/EditSoundPaneTestIds.ts'
import { TestAppProps } from '../TestApp.tsx'
import { Path, Volume } from '../../../utils/types/brandedTypes.ts'

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

  seekRightFine = (): Promise<void> =>
    this.step('seekRightFine', async () => {
      await this.page.keyboard.press('Shift+ArrowRight')
      await this.clockNext()
    })

  seekLeftFine = (): Promise<void> =>
    this.step('seekLeftFine', async () => {
      await this.page.keyboard.press('Shift+ArrowLeft')
      await this.clockNext()
    })

  seekLeft = (): Promise<void> =>
    this.step('seekLeft', async () => {
      await this.page.keyboard.press('ArrowLeft')
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

  get navbar() {
    return new NavbarPageObject(this.mountResult)
  }

  get shortcuts() {
    return new SoundsEditorKeyboardShortcutsPageObject(this.mountResult)
  }

  enterSoundName = (name: string): Promise<void> =>
    this.step(`enterSoundName ${name}`, async () => {
      await this.get(EditSoundPaneTestIds.soundNameInput).click()
      await this.get(EditSoundPaneTestIds.soundNameInput).fill(name)
      await this.page.keyboard.press('Enter')
    })

  pressCaptureAudio = ({
    primedOutcome = StartRecordingOutcome.SUCCESS,
  }: Partial<{ primedOutcome: StartRecordingOutcome }> = {}): Promise<void> =>
    this.step(`pressCaptureAudio primedOutcome=${primedOutcome}`, async () => {
      await this.testHooks.primeStartRecordingOutcome(primedOutcome)
      await this.press(EditSoundPaneTestIds.captureAudioButton)
    })

  primeNoAudioOnStopRecording = (): Promise<void> =>
    this.step('primeNoAudioOnStopRecording', () => this.testHooks.primeNoAudioOnStopRecording())

  pressStop = (): Promise<void> => this.step('pressStop', () => this.press(EditSoundPaneTestIds.stopButton))

  pressCropAudio = (): Promise<void> =>
    this.step('pressCropAudio', () => this.press(EditSoundPaneTestIds.cropAudioButton))

  pressImportAudioButton = (path: Path): Promise<void> =>
    this.step('pressImportAudioButton', async () => {
      const fileChooserPromise = this.page.waitForEvent('filechooser')
      await this.press(EditSoundPaneTestIds.importAudioButton)
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(path)
    })

  pressDownloadWav = (): Promise<Path> =>
    this.step('pressDownloadWav', async () =>
      this.triggerDownload(() => this.press(EditSoundPaneTestIds.downloadWavButton)),
    )

  pressPlayButton = (): Promise<void> => this.step('pressPlayButton', () => this.press(EditSoundPaneTestIds.playButton))

  pressPauseButton = (): Promise<void> =>
    this.step('pressPauseButton', () => this.press(EditSoundPaneTestIds.pauseButton))

  pressDelete = (): Promise<void> => this.step('pressDelete', () => this.press(EditSoundPaneTestIds.deleteButton))

  pressDuplicateSound = (): Promise<void> =>
    this.step('pressDuplicateSound', () => this.press(EditSoundPaneTestIds.duplicateButton))

  pressHomeLink = (): Promise<void> => this.step('pressHomeLink', () => this.press(NavbarTestIds.homeLink))

  clickCentreOfWaveform = (): Promise<void> =>
    this.step('clickCentreOfWaveform', async () => {
      await this.get(EditSoundPaneTestIds.waveformCanvas).click()
      await this.clockNext()
    })

  moveVolumeSliderLeft = (times: number): Promise<void> =>
    this.step(`moveVolumeSliderLeft ${times}`, async () => {
      await this.press(EditSoundPaneTestIds.volumeSlider)
      for (let i = 0; i < times; i++) {
        await this.page.keyboard.press('ArrowLeft')
      }
    })

  simulateAudioRecordingVolume = (volume: Volume): Promise<void> =>
    this.step(`simulateAudioRecordingVolume ${volume}`, async () => {
      await this.testHooks.simulateAudioRecordingVolume(volume)
      await this.clockNext()
    })

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.step('simulateAudioPlaybackComplete', () => this.testHooks.simulateAudioPlaybackComplete())

  getAudioRecorderState = (): Promise<AudioRecorderState> => this.testHooks.getAudioRecorderState()

  expectAudioRecorderStateToBe = (state: AudioRecorderState): Promise<void> =>
    this.step(`expectAudioRecorderStateToBe ${state}`, async () => {
      expect(await this.getAudioRecorderState()).toBe(state)
    })

  expectVolumeMeterToShowLevel = (volume: Volume): Promise<void> =>
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

export const launchAndCreateNewSound = async (
  mount: MountFunction,
  props: TestAppProps = {},
): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchApp(mount, props)
  await soundsEditorPage.sidebar.pressNewSound()
  return soundsEditorPage
}

export const launchAndStartAudioCapture = async (
  mount: MountFunction,
  props: TestAppProps = {},
): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchAndCreateNewSound(mount, props)
  await soundsEditorPage.pressCaptureAudio()
  return soundsEditorPage
}

export const launchAndRecordNewSound = async (mount: MountFunction): Promise<SoundsEditorPageObject> => {
  const soundsEditorPage = await launchAndStartAudioCapture(mount)
  await soundsEditorPage.pressStop()
  return soundsEditorPage
}
