import { StartRecordingOutcome } from '../../audio/IAudioRecorder.ts'

export interface WindowTestHooks {
  setVolume: (volume: number) => void
  setStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  clockNext: () => void
  clockTick: (millis: number) => void
}
