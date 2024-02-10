import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'

export interface WindowTestHooks {
  simulateVolume: (volume: number) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  primeNoAudioOnStopRecording: () => void
  simulateAudioPlaybackComplete: () => void

  getAudioRecorderState(): AudioRecorderState

  isAudioPlaying: boolean

  clockNext: () => void
  clockTick: (millis: number) => void
}
