import { unawaited } from '../utils/utils.ts'

export enum AudioRecorderState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
}

export type AudioRecorderStateChangeListener = (state: AudioRecorderState) => void

export type RecordingCompleteListener = (audio: Blob) => void

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | undefined = undefined
  private audioContext: AudioContext | undefined = undefined
  private mediaStream: MediaStream | undefined = undefined
  private getVolume: (() => number) | undefined = undefined
  private audioChunks: Blob[] = []
  private state: AudioRecorderState = AudioRecorderState.IDLE
  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []

  addStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners.push(listener)
  }

  private fireStateChangeListeners = (state: AudioRecorderState): void => {
    console.log('State changed:', state)
    this.stateChangeListeners.forEach((listener) => listener(state))
  }

  addRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    this.recordingCompleteListeners.push(listener)
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
    this.state = state
    this.fireStateChangeListeners(state)
  }

  public get volume(): number {
    return this.getVolume?.() ?? 0
  }

  startRecording = async (): Promise<void> => {
    if (this.state !== AudioRecorderState.IDLE) {
      throw new Error('Already recording')
    }
    this.setState(AudioRecorderState.RECORDING)
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: true })
      this.mediaStream.addEventListener('inactive', this.handleStreamInactive)
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(this.mediaStream)
      const analyser = audioContext.createAnalyser()
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
      const destination = audioContext.createMediaStreamDestination()
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
    console.log('Stopped recording')
    const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType })
    console.log(audioBlob)
    this.fireRecordingCompleteListeners(audioBlob)
    this.audioChunks = []
    if (this.audioContext) {
      unawaited(this.audioContext.close())
    }
    this.audioContext = undefined
    if (this.mediaRecorder) {
      this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable)
      this.mediaRecorder.removeEventListener('stop', this.handleMediaRecorderStop)
    }
    this.mediaRecorder = undefined
    this.mediaStream = undefined
  }

  dispose = () => {
    console.log('Disposing')
    this.stateChangeListeners = []
    this.recordingCompleteListeners = []

    this.setState(AudioRecorderState.IDLE)

    if (this.mediaRecorder) {
      this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable)
      this.mediaRecorder.removeEventListener('stop', this.handleMediaRecorderStop)
      this.mediaRecorder.stop()
    }
    this.mediaRecorder = undefined

    this.mediaStream?.getTracks().forEach((track) => track.stop())
    this.mediaStream = undefined

    if (this.audioContext) {
      unawaited(this.audioContext.close())
    }
    this.audioContext = undefined
  }

  stopRecording = (): void => {
    if (this.state !== AudioRecorderState.RECORDING) {
      throw new Error('Not recording')
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
    }
    this.mediaRecorder?.stop()
  }
  // https://github.com/yusitnikov/fix-webm-duration
  // https://github.com/buynao/webm-duration-fix
  // this.mediaRecorder.stop()
}
