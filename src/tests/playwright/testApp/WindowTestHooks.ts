import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { Seconds, Volume } from '../../../utils/types/brandedTypes.ts'

export interface WindowTestHooks {
  // Recording
  simulateAudioRecordingVolume(volume: Volume): void

  primeStartRecordingOutcome(outcome: StartRecordingOutcome): void

  primeNoAudioOnStopRecording(): void

  getAudioRecorderStatus(): AudioRecorderStatus

  // Playback
  simulateAudioPlaybackComplete(): void

  isAudioPlaying(): boolean

  getAudioPosition(): Seconds

  setAudioPosition(position: Seconds): void

  getAudioPlaybackVolume(): Volume

  // Sounds
  getSoundsJson(): string

  getSoundboardsJson(): string

  // Misc
  visitNotFoundPage(): void
}
