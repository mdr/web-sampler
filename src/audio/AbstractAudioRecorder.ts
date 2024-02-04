import { AudioRecorderState, AudioRecorderStateChangeListener, RecordingCompleteListener } from './AudioRecorder.ts'
import _ from 'lodash'

export class AbstractAudioRecorder {
  private readonly stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private readonly recordingCompleteListeners: RecordingCompleteListener[] = []
  private _state: AudioRecorderState = AudioRecorderState.IDLE

  addStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners.push(listener)
  }

  removeStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    _.remove(this.stateChangeListeners, (l) => l === listener)
  }

  private fireStateChangeListeners = (state: AudioRecorderState): void => {
    this.stateChangeListeners.forEach((listener) => listener(state))
  }

  addRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    this.recordingCompleteListeners.push(listener)
  }

  removeRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    _.remove(this.recordingCompleteListeners, (l) => l === listener)
  }

  protected fireRecordingCompleteListeners = (audio: ArrayBuffer): void => {
    this.recordingCompleteListeners.forEach((listener) => listener(audio))
  }

  protected setState = (state: AudioRecorderState) => {
    this._state = state
    this.fireStateChangeListeners(state)
  }

  get state(): AudioRecorderState {
    return this._state
  }
}
