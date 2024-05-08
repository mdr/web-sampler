import { MountResult } from '@playwright/experimental-ct-react'
import { WindowTestHooks } from './WindowTestHooks.ts'
import { Millis, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'

type Asyncify<T> = {
  [P in keyof T]: T[P] extends (...args: infer Args) => infer Return ? (...args: Args) => Promise<Return> : T[P]
}

export class ProxyWindowTestHooks implements Asyncify<WindowTestHooks> {
  constructor(private readonly mountResult: MountResult) {}

  simulateAudioRecordingVolume = (volume: Volume): Promise<void> =>
    this.mountResult.page().evaluate((volume: Volume) => window.testHooks.simulateAudioRecordingVolume(volume), volume)

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): Promise<void> =>
    this.mountResult
      .page()
      .evaluate((outcome: StartRecordingOutcome) => window.testHooks.primeStartRecordingOutcome(outcome), outcome)

  primeNoAudioOnStopRecording = (): Promise<void> =>
    this.mountResult.page().evaluate(() => window.testHooks.primeNoAudioOnStopRecording())

  getAudioRecorderState = (): Promise<AudioRecorderState> =>
    this.mountResult.page().evaluate(() => window.testHooks.getAudioRecorderState())

  simulateAudioPlaybackComplete = (): Promise<void> =>
    this.mountResult.page().evaluate(() => window.testHooks.simulateAudioPlaybackComplete())

  isAudioPlaying = (): Promise<boolean> => this.mountResult.page().evaluate(() => window.testHooks.isAudioPlaying())

  getAudioPosition = (): Promise<Seconds> => this.mountResult.page().evaluate(() => window.testHooks.getAudioPosition())

  getAudioPlaybackVolume = (): Promise<Volume> =>
    this.mountResult.page().evaluate(() => window.testHooks.getAudioPlaybackVolume())

  getSoundsJson = (): Promise<string> => this.mountResult.page().evaluate(() => window.testHooks.getSoundsJson())

  clockNext = (): Promise<void> => this.mountResult.page().evaluate(() => window.testHooks.clockNext())

  clockTick = (millis: Millis): Promise<void> =>
    this.mountResult.page().evaluate((millis: Millis) => window.testHooks.clockTick(millis), millis)

  visitNotFoundPage = (): Promise<void> => this.mountResult.page().evaluate(() => window.testHooks.visitNotFoundPage())
}
