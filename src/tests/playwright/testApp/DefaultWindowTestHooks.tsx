import { WindowTestHooks } from './WindowTestHooks.ts'
import { MockAudioRecorder } from '../mocks/MockAudioRecorder.ts'
import { InstalledClock } from '@sinonjs/fake-timers'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { MockAudioPlayer } from '../mocks/MockAudioPlayer.ts'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorder: MockAudioRecorder,
    private readonly audioPlayer: MockAudioPlayer,
    private readonly clock: InstalledClock,
  ) {}

  simulateVolume = (volume: number): void => {
    this.audioRecorder.volume = volume
  }

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): void => {
    this.audioRecorder.startRecordingOutcome = outcome
  }

  simulateAudioPlaybackComplete = () => {
    this.audioPlayer.completePlayback()
  }

  getAudioRecorderState = (): AudioRecorderState => this.audioRecorder.state

  get isAudioPlaying(): boolean {
    return this.audioPlayer.isPlaying
  }

  clockNext = () => this.clock.next()

  clockTick = (millis: number): void => {
    this.clock.tick(millis)
  }
}
