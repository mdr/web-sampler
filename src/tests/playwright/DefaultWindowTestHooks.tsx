import { WindowTestHooks } from './WindowTestHooks.ts'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { InstalledClock } from '@sinonjs/fake-timers'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorder: MockAudioRecorder,
    private readonly clock: InstalledClock,
  ) {}

  setVolume = async (volume: number): Promise<void> => {
    this.audioRecorder.volume = volume
  }
  clockNext = () => this.clock.next()

  clockTick = (millis: number): void => {
    this.clock.tick(millis)
  }
}
