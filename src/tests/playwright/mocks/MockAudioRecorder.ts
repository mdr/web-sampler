import {
  AudioRecorderState,
  AudioRecorderStateChangeListener,
  IAudioRecorder,
  RecordingCompleteListener,
} from '../../../audio/IAudioRecorder.ts'

export class MockAudioRecorder implements IAudioRecorder {
  volume: number = 0
  state: AudioRecorderState = AudioRecorderState.IDLE

  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []

  addStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners.push(listener)
  }

  removeRecordingCompleteListener = (listenerToRemove: RecordingCompleteListener): void => {
    this.recordingCompleteListeners = this.recordingCompleteListeners.filter(
      (listener) => listener !== listenerToRemove,
    )
  }

  private fireStateChangeListeners = (state: AudioRecorderState): void => {
    this.stateChangeListeners.forEach((listener) => listener(state))
  }

  addRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    this.recordingCompleteListeners.push(listener)
  }

  removeStateChangeListener = (listenerToRemove: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners = this.stateChangeListeners.filter((listener) => listener !== listenerToRemove)
  }

  fireRecordingCompleteListeners = (audio: Blob): void => {
    this.recordingCompleteListeners.forEach((listener) => listener(audio))
  }

  startRecording = async (): Promise<void> => {
    this.setState(AudioRecorderState.RECORDING)
  }

  stopRecording = (): void => {
    this.setState(AudioRecorderState.IDLE)
  }

  setState = (state: AudioRecorderState) => {
    this.fireStateChangeListeners(state)
  }
}
