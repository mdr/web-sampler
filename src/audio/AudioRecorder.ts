import {
  AudioRecorderState,
  AudioRecorderStateChangeListener,
  IAudioRecorder,
  RecordingCompleteListener,
} from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'
import audioBufferToWav from 'audiobuffer-to-wav'
import { AudioBufferUtils } from './AudioBufferUtils.ts'
import workletUrl from './CapturingAudioWorkletProcessor?worker&url'
import { CAPTURING_AUDIO_WORKLET_NAME, STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'

export class LazyAudioContextProvider implements AudioContextProvider {
  private _audioContext: Option<AudioContext> = undefined

  get audioContext(): AudioContext {
    if (this._audioContext === undefined) {
      this._audioContext = new AudioContext()
    }
    return this._audioContext
  }
}

export interface AudioContextProvider {
  audioContext: AudioContext
}

export class AudioRecorder implements IAudioRecorder {
  private _state: AudioRecorderState = AudioRecorderState.IDLE
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioBuffers: AudioBuffer[] = []
  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []
  private captureAudioWorkletNode: Option<AudioWorkletNode> = undefined
  private source: Option<MediaStreamAudioSourceNode> = undefined

  private get audioContext(): AudioContext {
    return this.audioContextProvider.audioContext
  }

  private get audioBufferUtils(): AudioBufferUtils {
    return new AudioBufferUtils(this.audioContext)
  }

  constructor(private readonly audioContextProvider: AudioContextProvider) {}

  addStateChangeListener = (listener: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners.push(listener)
  }

  removeStateChangeListener = (listenerToRemove: AudioRecorderStateChangeListener): void => {
    this.stateChangeListeners = this.stateChangeListeners.filter((listener) => listener !== listenerToRemove)
  }

  private fireStateChangeListeners = (state: AudioRecorderState): void => {
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
    this.recordingCompleteListeners.forEach((listener) => listener(audio))
  }

  private handleStreamInactive = () => {
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

  private handleWorkletMessage = (event: MessageEvent<Float32Array>) => {
    const audioBuffer = this.audioBufferUtils.audioBufferFromFloat32Array(event.data)
    this.audioBuffers.push(audioBuffer)
  }

  startRecording = async (): Promise<void> => {
    if (this._state !== AudioRecorderState.IDLE) {
      throw new Error('Already recording')
    }
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false,
        },
      })
    } catch (error) {
      console.error('Error setting up recording:', error)
      return
    }

    this.setState(AudioRecorderState.RECORDING)
    await this.audioContext.audioWorklet.addModule(workletUrl)
    this.mediaStream.addEventListener('inactive', this.handleStreamInactive)
    const source = this.audioContext.createMediaStreamSource(this.mediaStream)
    this.source = source

    const analyser = this.audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    this.getVolume = (): number => {
      analyser.getByteFrequencyData(dataArray)
      return average(dataArray)
    }

    const captureAudioWorkletNode = new AudioWorkletNode(this.audioContext, CAPTURING_AUDIO_WORKLET_NAME)
    source.connect(captureAudioWorkletNode)
    captureAudioWorkletNode.port.onmessage = this.handleWorkletMessage
    this.captureAudioWorkletNode = captureAudioWorkletNode
  }

  stopRecording = (): void => {
    if (this._state !== AudioRecorderState.RECORDING) {
      throw new Error('Not recording')
    }
    this.setState(AudioRecorderState.IDLE)
    const combinedBuffer = this.audioBufferUtils.combineAudioBuffers(this.audioBuffers)
    this.audioBuffers = []
    if (combinedBuffer !== undefined) {
      this.fireRecordingCompleteListeners(this.makeWavBlob(combinedBuffer))
    }

    this.source?.disconnect()
    this.source = undefined

    if (this.captureAudioWorkletNode) {
      this.captureAudioWorkletNode.port.onmessage = null
      this.captureAudioWorkletNode.port.postMessage(STOP_MESSAGE)
    }
    this.captureAudioWorkletNode = undefined

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
