import { WindowTestHooks } from './WindowTestHooks.ts'
import { MockAudioRecorder } from '../mocks/MockAudioRecorder.ts'
import { InstalledClock } from '@sinonjs/fake-timers'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { MockAudioElement } from '../mocks/MockAudioElement.ts'
import { SoundLibrary } from '../../../sounds/SoundLibrary.ts'
import { serialiseSounds } from './soundsSerialisation.ts'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorder: MockAudioRecorder,
    private readonly audioElement: MockAudioElement,
    private readonly clock: InstalledClock,
    private readonly soundLibrary: SoundLibrary,
  ) {}

  simulateVolume = (volume: number): void => {
    this.audioRecorder.volume = volume
  }

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): void => {
    this.audioRecorder.startRecordingOutcome = outcome
  }

  primeNoAudioOnStopRecording = (): void => {
    this.audioRecorder.noAudioOnStopRecording = true
  }

  getAudioRecorderState = (): AudioRecorderState => this.audioRecorder.state

  simulateAudioPlaybackComplete = () => {
    this.audioElement.completePlayback()
  }

  get isAudioPlaying(): boolean {
    return !this.audioElement.paused
  }

  clockNext = () => this.clock.next()

  clockTick = (millis: number): void => {
    this.clock.tick(millis)
  }

  getSoundsJson = (): string => serialiseSounds(this.soundLibrary.sounds)
}
