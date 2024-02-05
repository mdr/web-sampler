import { AudioRecorderState, StartRecordingOutcome } from '../../audio/AudioRecorder.ts'

export interface WindowTestHooks {
  simulateVolume: (volume: number) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void

  getAudioRecorderState(): AudioRecorderState

  clockNext: () => void
  clockTick: (millis: number) => void
}
