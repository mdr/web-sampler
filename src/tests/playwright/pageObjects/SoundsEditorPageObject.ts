import { expect } from '@playwright/experimental-ct-react'
import { Locator } from 'playwright'

import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { EditSoundPaneTestIds } from '../../../components/soundsEditor/editSoundPane/EditSoundPaneTestIds.ts'
import { SoundsSidebarTestIds } from '../../../components/soundsEditor/sidebar/SoundsSidebarTestIds.ts'
import { Path, Volume } from '../../../utils/types/brandedTypes.ts'
import { TestAppProps } from '../TestApp.tsx'
import { MountFunction } from '../types.ts'
import { NavbarPageObject } from './NavbarPageObject.ts'
import { PageObject } from './PageObject.ts'
import { ShortcutsDialogPageObject } from './ShortcutsDialogPageObject.ts'
import { SoundsEditorKeyboardShortcutsPageObject } from './SoundsEditorKeyboardShortcutsPageObject.ts'
import { SoundsSidebarPageObject } from './SoundsSidebarPageObject.ts'
import { launchApp } from './launchApp.tsx'

export class SoundsEditorPageObject extends PageObject {
  verifyIsShown = async (): Promise<SoundsEditorPageObject> =>
    this.step('verifyIsShown', async () => {
      await expect(this.get(SoundsSidebarTestIds.sidebar)).toBeVisible()
      return this
    })

  get sidebar(): SoundsSidebarPageObject {
    return new SoundsSidebarPageObject(this.mountResult)
  }

  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }

  get shortcuts(): SoundsEditorKeyboardShortcutsPageObject {
    return new SoundsEditorKeyboardShortcutsPageObject(this.mountResult)
  }

  enterSoundName = (name: string): Promise<void> =>
    this.step(`enterSoundName ${name}`, async () => {
      await this.get(EditSoundPaneTestIds.soundNameInput).click()
      await this.get(EditSoundPaneTestIds.soundNameInput).fill(name)
      await this.page.keyboard.press('Enter')
    })

  createSound = (name: string): Promise<void> =>
    this.step(`createSound ${name}`, async () => {
      await this.sidebar.pressNewSound()
      await this.enterSoundName(name)
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
    this.step('pressImportAudioButton', () => this.clickAndUploadFile(EditSoundPaneTestIds.importAudioButton, path))

  pressDownloadWav = (): Promise<Path> =>
    this.step('pressDownloadWav', async () =>
      this.triggerDownload(() => this.press(EditSoundPaneTestIds.downloadWavButton)),
    )

  pressDownloadMp3 = (): Promise<Path> =>
    this.step('pressDownloadMp3', async () =>
      this.triggerDownload(() => this.press(EditSoundPaneTestIds.downloadMp3Button)),
    )

  pressPlayButton = (): Promise<void> => this.step('pressPlayButton', () => this.press(EditSoundPaneTestIds.playButton))

  pressPauseButton = (): Promise<void> =>
    this.step('pressPauseButton', () => this.press(EditSoundPaneTestIds.pauseButton))

  pressDelete = (): Promise<void> => this.step('pressDelete', () => this.press(EditSoundPaneTestIds.deleteButton))

  pressShortcutsButton = (): Promise<ShortcutsDialogPageObject> =>
    this.step('pressShortcutsButton', async () => {
      await this.press(EditSoundPaneTestIds.shortcutsButton)
      return new ShortcutsDialogPageObject(this.mountResult).verifyIsShown()
    })

  pressDuplicateSound = (): Promise<void> =>
    this.step('pressDuplicateSound', () => this.press(EditSoundPaneTestIds.duplicateButton))

  clickCentreOfWaveform = (): Promise<void> =>
    this.step('clickCentreOfWaveform', async () => {
      await this.get(EditSoundPaneTestIds.waveformCanvas).click()
      await this.shortWait()
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
      await this.shortWait()
    })

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.step('simulateAudioPlaybackComplete', () => this.testHooks.simulateAudioPlaybackComplete())

  getAudioRecorderState = (): Promise<AudioRecorderStatus> => this.testHooks.getAudioRecorderStatus()

  get waveformCanvas(): Locator {
    return this.get(EditSoundPaneTestIds.waveformCanvas)
  }

  dragStartTimeHandleRight = (): Promise<void> =>
    this.step('dragStartHandle', () =>
      this.waveformCanvas.dragTo(this.waveformCanvas, {
        sourcePosition: { x: 2, y: 2 },
        targetPosition: { x: 100, y: 5 },
      }),
    )

  expectAudioRecorderStatusToBe = (status: AudioRecorderStatus): Promise<void> =>
    this.step(`expectAudioRecorderStatusToBe ${status}`, async () => {
      expect(await this.getAudioRecorderState()).toBe(status)
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
      await this.shortWait()
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
