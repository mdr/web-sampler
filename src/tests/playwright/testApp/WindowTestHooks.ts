import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { Millis, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'

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

  getAudioPlaybackVolume(): Volume

  // Sounds
  getSoundsJson(): string

  getSoundboardsJson(): string

  // Clock
  clockNext(): void

  clockTick(millis: Millis): void

  // Misc
  visitNotFoundPage(): void
}
