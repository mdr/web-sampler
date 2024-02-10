import { WindowTestHooks } from './WindowTestHooks.ts'
import { MockAudioRecorder } from '../mocks/MockAudioRecorder.ts'
import { InstalledClock } from '@sinonjs/fake-timers'
import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorder: MockAudioRecorder,
    private readonly clock: InstalledClock,
  ) {}

  simulateVolume = (volume: number): void => {
    this.audioRecorder.volume = volume
  }

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): void => {
    this.audioRecorder.startRecordingOutcome = outcome
  }

  getAudioRecorderState = (): AudioRecorderState => this.audioRecorder.state

  clockNext = () => this.clock.next()

  clockTick = (millis: number): void => {
    this.clock.tick(millis)
  }
}
