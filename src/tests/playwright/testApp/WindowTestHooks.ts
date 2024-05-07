import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { Millis, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'

export interface WindowTestHooks {
  // Recording
  simulateAudioRecordingVolume: (volume: Volume) => void
  primeStartRecordingOutcome: (outcome: StartRecordingOutcome) => void
  primeNoAudioOnStopRecording: () => void

  getAudioRecorderState(): AudioRecorderState

  // Playback
  simulateAudioPlaybackComplete: () => void
  isAudioPlaying: boolean
  audioPosition: Seconds
  audioPlaybackVolume: Volume

  // Sounds
  getSoundsJson(): string

  // Clock
  clockNext: () => void
  clockTick: (millis: Millis) => void

  visitNotFoundPage: () => boolean
}
