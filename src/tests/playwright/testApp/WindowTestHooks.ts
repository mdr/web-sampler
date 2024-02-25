import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'

export interface WindowTestHooks {
  // Recording
  simulateVolume: (volume: number) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  primeNoAudioOnStopRecording: () => void

  getAudioRecorderState(): AudioRecorderState

  // Playback
  simulateAudioPlaybackComplete: () => void
  isAudioPlaying: boolean

  // Sounds
  getSoundsJson(): string

  // Clock
  clockNext: () => void
  clockTick: (millis: number) => void
}
