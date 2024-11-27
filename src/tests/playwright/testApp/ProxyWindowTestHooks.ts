import { MountResult } from '@playwright/experimental-ct-react'

import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { WindowTestHooks } from './WindowTestHooks.ts'

type Asyncify<T> = {
  [P in keyof T]: T[P] extends (...args: infer Args) => infer Return ? (...args: Args) => Promise<Return> : T[P]
}

export class ProxyWindowTestHooks implements Asyncify<WindowTestHooks> {
  constructor(private readonly mountResult: MountResult) {}

  private get testHooks(): WindowTestHooks {
    if (window.testHooks === undefined) {
      throw new Error('Test hooks not installed')
    }
    return window.testHooks
  }

  simulateAudioRecordingVolume = (volume: Volume): Promise<void> =>
    this.mountResult.page().evaluate((volume: Volume) => this.testHooks.simulateAudioRecordingVolume(volume), volume)

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): Promise<void> =>
    this.mountResult
      .page()
      .evaluate((outcome: StartRecordingOutcome) => this.testHooks.primeStartRecordingOutcome(outcome), outcome)

  primeNoAudioOnStopRecording = (): Promise<void> =>
    this.mountResult.page().evaluate(() => this.testHooks.primeNoAudioOnStopRecording())

  getAudioRecorderStatus = (): Promise<AudioRecorderStatus> =>
    this.mountResult.page().evaluate(() => this.testHooks.getAudioRecorderStatus())

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.mountResult.page().evaluate(() => this.testHooks.simulateAudioPlaybackComplete())

  isAudioPlaying = (): Promise<boolean> => this.mountResult.page().evaluate(() => this.testHooks.isAudioPlaying())

  getAudioPosition = (): Promise<Seconds> => this.mountResult.page().evaluate(() => this.testHooks.getAudioPosition())

  setAudioPosition = (position: Seconds): Promise<void> =>
    this.mountResult.page().evaluate((position: Seconds) => this.testHooks.setAudioPosition(position), position)

  getAudioPlaybackVolume = (): Promise<Volume> =>
    this.mountResult.page().evaluate(() => this.testHooks.getAudioPlaybackVolume())

  getSoundsJson = (): Promise<string> => this.mountResult.page().evaluate(() => this.testHooks.getSoundsJson())

  getSoundboardsJson = (): Promise<string> =>
    this.mountResult.page().evaluate(() => this.testHooks.getSoundboardsJson())

  visitNotFoundPage = (): Promise<void> => this.mountResult.page().evaluate(() => this.testHooks.visitNotFoundPage())
}
