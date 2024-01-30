import {
  AudioRecorderState,
  AudioRecorderStateChangeListener,
  IAudioRecorder,
  RecordingCompleteListener,
} from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'
import toWav from 'audiobuffer-to-wav'

export class AudioRecorder implements IAudioRecorder {
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioBuffers: AudioBuffer[] = []
  private _state: AudioRecorderState = AudioRecorderState.IDLE
  private stateChangeListeners: AudioRecorderStateChangeListener[] = []
  private recordingCompleteListeners: RecordingCompleteListener[] = []
  private captureAudioNode: Option<ScriptProcessorNode> = undefined

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
    const audioBuffer = this.cloneAudioBuffer(event.inputBuffer)
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

        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        return sum / dataArray.length
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
    const combinedBuffer = this.combineAudioBuffers(this.audioBuffers)
    console.log(combinedBuffer)
    this.audioBuffers = []

    if (combinedBuffer !== undefined) {
      const wavBlob = new Blob([toWav(combinedBuffer)], { type: 'audio/wav' })
      this.fireRecordingCompleteListeners(wavBlob)
      console.log(wavBlob)
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

  // https://github.com/yusitnikov/fix-webm-duration
  // https://github.com/buynao/webm-duration-fix
  // this.mediaRecorder.stop()

  private combineAudioBuffers = (audioBuffers: AudioBuffer[]): Option<AudioBuffer> => {
    if (audioBuffers.length === 0) {
      return undefined
    }
    // Calculate the total length of the combined buffer
    const totalLength = audioBuffers.reduce((acc, buffer) => acc + buffer.length, 0)

    const numberOfChannels = audioBuffers[0].numberOfChannels
    const sampleRate = audioBuffers[0].sampleRate
    const combinedBuffer = this.audioContext.createBuffer(numberOfChannels, totalLength, sampleRate)

    let offset = 0
    audioBuffers.forEach((buffer) => {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const inputData = buffer.getChannelData(channel)
        combinedBuffer.getChannelData(channel).set(inputData, offset)
      }
      offset += buffer.length
    })

    return combinedBuffer
  }

  private cloneAudioBuffer = (originalBuffer: AudioBuffer): AudioBuffer => {
    const numberOfChannels = originalBuffer.numberOfChannels
    const length = originalBuffer.length
    const sampleRate = originalBuffer.sampleRate

    const newBuffer = this.audioContext.createBuffer(numberOfChannels, length, sampleRate)

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const originalData = originalBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)
      newData.set(originalData)
    }

    return newBuffer
  }
}
