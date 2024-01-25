import {
  AudioRecorderState,
  AudioRecorderStateChangeListener,
  IAudioRecorder,
  RecordingCompleteListener,
} from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'

export class AudioRecorder implements IAudioRecorder {
  private mediaRecorder: Option<MediaRecorder> = undefined
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioChunks: Blob[] = []
  private _state: AudioRecorderState = AudioRecorderState.IDLE
  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []

  constructor(private readonly audioContext: AudioContext) {}

  addStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners.push(listener)
  }

  removeStateChangeListener = (listenerToRemove: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners = this.stateChangeListeners.filter((listener) => listener !== listenerToRemove)
  }

  private fireStateChangeListeners = (state: AudioRecorderState): void => {
    console.log('State changed:', state)
    this.stateChangeListeners.forEach((listener) => listener(state))
  }

  addRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    this.recordingCompleteListeners.push(listener)
  }

  removeRecordingCompleteListener = (listenerToRemove: RecordingCompleteListener): void => {
    this.recordingCompleteListeners = this.recordingCompleteListeners.filter(
      (listener) => listener !== listenerToRemove,
    )
  }

  private fireRecordingCompleteListeners = (audio: Blob): void => {
    console.log('Recording complete')
    this.recordingCompleteListeners.forEach((listener) => listener(audio))
  }

  private handleStreamInactive = () => {
    console.log('Stream inactive')
    this.mediaRecorder?.stop()
  }

  private handleDataAvailable = (event: BlobEvent) => {
    console.log('Data available', event)
    this.audioChunks.push(event.data)
  }

  private setState = (state: AudioRecorderState) => {
    this._state = state
    this.fireStateChangeListeners(state)
  }

  get volume(): number {
    return this.getVolume?.() ?? 0
  }

  get state(): AudioRecorderState {
    return this._state
  }

  startRecording = async (): Promise<void> => {
    if (this._state !== AudioRecorderState.IDLE) {
      throw new Error('Already recording')
    }
    this.setState(AudioRecorderState.RECORDING)
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: true })
      this.mediaStream.addEventListener('inactive', this.handleStreamInactive)
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      const analyser = this.audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      this.getVolume = (): number => {
        analyser.getByteFrequencyData(dataArray)

        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        return sum / dataArray.length
      }
      const destination = this.audioContext.createMediaStreamDestination()
      source.connect(destination)
      const mediaRecorder = new MediaRecorder(destination.stream)
      mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable)
      mediaRecorder.addEventListener('stop', this.handleMediaRecorderStop)
      mediaRecorder.start()
      this.mediaRecorder = mediaRecorder
    } catch (error) {
      console.error('Error setting up recording:', error)
      this.setState(AudioRecorderState.IDLE)
      throw error
    }
  }

  private handleMediaRecorderStop = () => {
    this.setState(AudioRecorderState.IDLE)
    console.log('Recording finished')
    const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType })
    console.log(audioBlob)
    this.fireRecordingCompleteListeners(audioBlob)
    this.audioChunks = []

    if (this.mediaRecorder) {
      this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable)
      this.mediaRecorder.removeEventListener('stop', this.handleMediaRecorderStop)
    }
    this.mediaRecorder = undefined

    this.mediaStream?.getTracks().forEach((track) => track.stop())
    this.mediaStream = undefined

    this.getVolume = undefined
  }

  stopRecording = (): void => {
    if (this._state !== AudioRecorderState.RECORDING) {
      throw new Error('Not recording')
    }
    this.mediaRecorder?.stop()
  }
  // https://github.com/yusitnikov/fix-webm-duration
  // https://github.com/buynao/webm-duration-fix
  // this.mediaRecorder.stop()
}
