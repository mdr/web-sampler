import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { Seconds, Volume } from '../../../utils/types/brandedTypes.ts'

export interface WindowTestHooks {
  // Recording
  simulateAudioRecordingVolume: (volume: number) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  primeNoAudioOnStopRecording: () => void

  getAudioRecorderState(): AudioRecorderState

  // Playback
  simulateAudioPlaybackComplete: () => void
  isAudioPlaying: boolean
  audioPosition: Seconds
  volume: Volume

  // Sounds
  getSoundsJson(): string

  // Clock
  clockNext: () => void
  clockTick: (millis: number) => void
}
