export enum AudioRecorderState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
}

export type AudioRecorderStateChangeListener = (state: AudioRecorderState) => void

export type RecordingCompleteListener = (audio: Blob) => void

export interface IAudioRecorder {
  addStateChangeListener: (listener: AudioRecorderStateChangeListener) => void
  removeStateChangeListener: (listener: AudioRecorderStateChangeListener) => void
  addRecordingCompleteListener: (listener: RecordingCompleteListener) => void
  removeRecordingCompleteListener: (listener: RecordingCompleteListener) => void
  startRecording: () => Promise<void>
  stopRecording: () => void
  state: AudioRecorderState
  volume: number
}
