import { Option } from '../utils/types/Option.ts'
import { Volume } from '../utils/types/brandedTypes.ts'
import { AudioData } from '../types/AudioData.ts'

export enum AudioRecorderState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
}

export enum StartRecordingOutcome {
  SUCCESS = 'SUCCESS',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  NO_AUDIO_TRACK = 'NO_AUDIO_TRACK',
}

export type AudioRecorderStateChangeListener = (state: AudioRecorderState) => void

// audio is undefined if the recording was empty
export type RecordingCompleteListener = (audioData: Option<AudioData>) => void

export interface AudioRecorder {
  addStateChangeListener(listener: AudioRecorderStateChangeListener): void

  removeStateChangeListener(listener: AudioRecorderStateChangeListener): void

  addRecordingCompleteListener(listener: RecordingCompleteListener): void

  removeRecordingCompleteListener(listener: RecordingCompleteListener): void

  startRecording(): Promise<StartRecordingOutcome>

  stopRecording(): void

  readonly state: AudioRecorderState

  readonly volume: Volume
}
