import { AudioRecorderState, StartRecordingOutcome } from '../../audio/AudioRecorder.ts'

export interface WindowTestHooks {
  setVolume: (volume: number) => void
  setStartRecordingOutcome: (outcome: StartRecordingOutcome) => void

  getAudioRecorderState(): AudioRecorderState

  clockNext: () => void
  clockTick: (millis: number) => void
}
