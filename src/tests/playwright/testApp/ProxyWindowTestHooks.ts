import { MountResult } from '@playwright/experimental-ct-react'
import { WindowTestHooks } from './WindowTestHooks.ts'
import { Millis, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'

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

  getAudioRecorderState = (): Promise<AudioRecorderState> =>
    this.mountResult.page().evaluate(() => this.testHooks.getAudioRecorderState())

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.mountResult.page().evaluate(() => this.testHooks.simulateAudioPlaybackComplete())

  isAudioPlaying = (): Promise<boolean> => this.mountResult.page().evaluate(() => this.testHooks.isAudioPlaying())

  getAudioPosition = (): Promise<Seconds> => this.mountResult.page().evaluate(() => this.testHooks.getAudioPosition())

  getAudioPlaybackVolume = (): Promise<Volume> =>
    this.mountResult.page().evaluate(() => this.testHooks.getAudioPlaybackVolume())

  getSoundsJson = (): Promise<string> => this.mountResult.page().evaluate(() => this.testHooks.getSoundsJson())

  getSoundboardsJson = (): Promise<string> =>
    this.mountResult.page().evaluate(() => this.testHooks.getSoundboardsJson())

  clockNext = (): Promise<void> => this.mountResult.page().evaluate(() => this.testHooks.clockNext())

  clockTick = (millis: Millis): Promise<void> =>
    this.mountResult.page().evaluate((millis: Millis) => this.testHooks.clockTick(millis), millis)

  visitNotFoundPage = (): Promise<void> => this.mountResult.page().evaluate(() => this.testHooks.visitNotFoundPage())
}
