import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { Seconds } from '../../../utils/types/brandedTypes.ts'

export interface WindowTestHooks {
  // Recording
  simulateVolume: (volume: number) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  primeNoAudioOnStopRecording: () => void

  getAudioRecorderState(): AudioRecorderState

  // Playback
  simulateAudioPlaybackComplete: () => void
  isAudioPlaying: boolean
  audioPosition: Seconds

  // Sounds
  getSoundsJson(): string

  // Clock
  clockNext: () => void
  clockTick: (millis: number) => void
}
