import {
  AudioRecorderState,
  AudioRecorderStateChangeListener,
  IAudioRecorder,
  RecordingCompleteListener,
} from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'
import audioBufferToWav from 'audiobuffer-to-wav'
import { AudioBufferUtils } from './AudioBufferUtils.ts'

export class AudioRecorder implements IAudioRecorder {
  private _state: AudioRecorderState = AudioRecorderState.IDLE
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioBuffers: AudioBuffer[] = []
  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []
  private captureAudioNode: Option<ScriptProcessorNode> = undefined
  private readonly audioBufferUtils: AudioBufferUtils

  constructor(private readonly audioContext: AudioContext) {
    this.audioBufferUtils = new AudioBufferUtils(audioContext)
  }

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
    this.stopRecording()
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

  private handleAudioProcess = (event: AudioProcessingEvent) => {
    const audioBuffer = this.audioBufferUtils.cloneAudioBuffer(event.inputBuffer)
    this.audioBuffers.push(audioBuffer)
  }

  startRecording = async (): Promise<void> => {
    if (this._state !== AudioRecorderState.IDLE) {
      throw new Error('Already recording')
    }
    this.setState(AudioRecorderState.RECORDING)
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: true })
      await this.audioContext.resume()
      this.mediaStream.addEventListener('inactive', this.handleStreamInactive)
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)

      const analyser = this.audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      this.getVolume = (): number => {
        analyser.getByteFrequencyData(dataArray)
        return average(dataArray)
      }

      const captureAudioNode = this.audioContext.createScriptProcessor(4096, 1, 1)
      captureAudioNode.addEventListener('audioprocess', this.handleAudioProcess)
      source.connect(captureAudioNode)
      captureAudioNode.connect(this.audioContext.destination)
      this.captureAudioNode = captureAudioNode
    } catch (error) {
      console.error('Error setting up recording:', error)
      this.setState(AudioRecorderState.IDLE)
      throw error
    }
  }

  stopRecording = (): void => {
    if (this._state !== AudioRecorderState.RECORDING) {
      throw new Error('Not recording')
    }
    this.setState(AudioRecorderState.IDLE)
    console.log('Recording finished')
    const combinedBuffer = this.audioBufferUtils.combineAudioBuffers(this.audioBuffers)
    this.audioBuffers = []
    if (combinedBuffer !== undefined) {
      this.fireRecordingCompleteListeners(this.makeWavBlob(combinedBuffer))
    }
    if (this.captureAudioNode) {
      this.captureAudioNode.removeEventListener('audioprocess', this.handleAudioProcess)
    }
    this.captureAudioNode = undefined

    this.mediaStream?.removeEventListener('inactive', this.handleStreamInactive)
    this.mediaStream?.getTracks().forEach((track) => track.stop())
    this.mediaStream = undefined

    this.getVolume = undefined
  }

  private makeWavBlob = (audioBuffer: AudioBuffer): Blob =>
    new Blob([audioBufferToWav(audioBuffer)], { type: 'audio/wav' })
}

const average = (dataArray: Uint8Array): number => {
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }
  return sum / dataArray.length
}
