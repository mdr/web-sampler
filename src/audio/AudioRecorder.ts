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

export type RecordingCompleteListener = (audio: Float32Array) => void

export interface AudioRecorder {
  addStateChangeListener(listener: AudioRecorderStateChangeListener): void

  removeStateChangeListener(listener: AudioRecorderStateChangeListener): void

  addRecordingCompleteListener(listener: RecordingCompleteListener): void

  removeRecordingCompleteListener(listener: RecordingCompleteListener): void

  startRecording(): Promise<StartRecordingOutcome>

  stopRecording(): void

  readonly state: AudioRecorderState

  readonly volume: number
}