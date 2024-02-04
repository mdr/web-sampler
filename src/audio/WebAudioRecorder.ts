import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from './AudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'
import { audioBufferToArrayBuffer, AudioBufferUtils } from './AudioBufferUtils.ts'
import workletUrl from './CapturingAudioWorkletProcessor?worker&url'
import { CAPTURING_AUDIO_WORKLET_NAME, STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'
import { AudioContextProvider } from './AudioContextProvider.ts'
import { AbstractAudioRecorder } from './AbstractAudioRecorder.ts'
import _ from 'lodash'

export class WebAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioBuffers: AudioBuffer[] = []
  private captureAudioWorkletNode: Option<AudioWorkletNode> = undefined
  private source: Option<MediaStreamAudioSourceNode> = undefined

  constructor(private readonly audioContextProvider: AudioContextProvider) {
    super()
  }

  private get audioContext(): AudioContext {
    return this.audioContextProvider.audioContext
  }

  private get audioBufferUtils(): AudioBufferUtils {
    return new AudioBufferUtils(this.audioContext)
  }

  private handleStreamInactive = () => {
    this.stopRecording()
  }

  get volume(): number {
    return this.getVolume?.() ?? 0
  }

  private handleWorkletMessage = (event: MessageEvent<Float32Array>) => {
    const audioBuffer = this.audioBufferUtils.audioBufferFromFloat32Array(event.data)
    this.audioBuffers.push(audioBuffer)
  }

  startRecording = async (): Promise<StartRecordingOutcome> => {
    if (this.state !== AudioRecorderState.IDLE) {
      throw new Error('Already recording')
    }

    let mediaStream: MediaStream
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false,
        },
      })
    } catch (error) {
      console.error('Error setting up recording:', error)
      return StartRecordingOutcome.PERMISSION_DENIED
    }

    if (mediaStream.getAudioTracks().length === 0) {
      console.error('No audio track in media stream')
      mediaStream.getTracks().forEach((track) => track.stop())
      return StartRecordingOutcome.NO_AUDIO_TRACK
    }

    this.mediaStream = mediaStream

    this.setState(AudioRecorderState.RECORDING)
    await this.audioContext.audioWorklet.addModule(workletUrl)
    mediaStream.addEventListener('inactive', this.handleStreamInactive)
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
    return StartRecordingOutcome.SUCCESS
  }

  stopRecording = (): void => {
    if (this.state !== AudioRecorderState.RECORDING) {
      throw new Error('Not recording')
    }
    this.setState(AudioRecorderState.IDLE)
    const combinedBuffer = this.audioBufferUtils.combineAudioBuffers(this.audioBuffers)
    this.audioBuffers = []
    if (combinedBuffer !== undefined) {
      const audio = audioBufferToArrayBuffer(combinedBuffer)
      this.fireRecordingCompleteListeners(audio)
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
}

const average = (dataArray: Uint8Array): number => {
  if (dataArray.length === 0) {
    return 0
  }
  return _.sum(dataArray) / dataArray.length
}
