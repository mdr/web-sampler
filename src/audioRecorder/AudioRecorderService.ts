import _ from 'lodash'

import { AudioData } from '../types/AudioData.ts'
import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { Option } from '../utils/types/Option.ts'
import { Hz, Pcm, Url, Volume } from '../utils/types/brandedTypes.ts'
import { average, concatenateFloat32Arrays } from '../utils/utils.ts'
import { AudioContextProvider } from './AudioContextProvider.ts'
import { RecordingCompleteListener, StartRecordingOutcome } from './AudioRecorder.ts'
import { CAPTURING_AUDIO_WORKLET_NAME, STOP_MESSAGE } from './worklet/CapturingAudioWorkletConstants.ts'

export enum AudioRecorderStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
}

export interface AudioRecorderState {
  status: AudioRecorderStatus
}

export interface AudioRecorderActions {
  startRecording(): Promise<StartRecordingOutcome>

  stopRecording(): void
}

export class AudioRecorderService extends AbstractService<AudioRecorderState> implements AudioRecorderActions {
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => Volume> = undefined
  private audioPieces: Float32Array[] = []
  private captureAudioWorkletNode: Option<AudioWorkletNode> = undefined
  private source: Option<MediaStreamAudioSourceNode> = undefined
  private readonly recordingCompleteListeners: RecordingCompleteListener[] = []

  constructor(
    private readonly audioContextProvider: AudioContextProvider,
    private readonly workletUrl: Url,
  ) {
    super({ status: AudioRecorderStatus.IDLE })
  }

  private get audioContext(): AudioContext {
    return this.audioContextProvider.audioContext
  }

  private handleStreamInactive = () => {
    this.stopRecording()
  }

  get volume(): Volume {
    return Volume(this.getVolume?.() ?? 0)
  }

  private handleWorkletMessage = (event: MessageEvent<Float32Array>) => {
    this.audioPieces.push(event.data)
  }

  startRecording = async (): Promise<StartRecordingOutcome> => {
    if (this.state.status !== AudioRecorderStatus.IDLE) {
      throw new Error('Already recording')
    }

    await this.audioContext.resume()

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
      console.warn('Error setting up recording:', error)
      return StartRecordingOutcome.CANCELLED_BY_USER
    }

    if (mediaStream.getAudioTracks().length === 0) {
      console.error('No audio track in media stream')
      mediaStream.getTracks().forEach((track) => track.stop())
      return StartRecordingOutcome.NO_AUDIO_TRACK
    }

    this.mediaStream = mediaStream

    this.setState({ status: AudioRecorderStatus.RECORDING })
    await this.audioContext.audioWorklet.addModule(this.workletUrl)
    mediaStream.addEventListener('inactive', this.handleStreamInactive)
    const source = this.audioContext.createMediaStreamSource(this.mediaStream)
    this.source = source

    this.startMonitoringVolume(source)

    const captureAudioWorkletNode = new AudioWorkletNode(this.audioContext, CAPTURING_AUDIO_WORKLET_NAME)
    source.connect(captureAudioWorkletNode)
    captureAudioWorkletNode.port.onmessage = this.handleWorkletMessage
    this.captureAudioWorkletNode = captureAudioWorkletNode
    return StartRecordingOutcome.SUCCESS
  }

  private startMonitoringVolume = (source: MediaStreamAudioSourceNode): void => {
    const analyser = this.audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    this.getVolume = (): Volume => {
      analyser.getByteFrequencyData(dataArray)
      return Volume((average(dataArray) ?? 0) / 255)
    }
  }

  stopRecording = (): void => {
    if (this.state.status !== AudioRecorderStatus.RECORDING) {
      return
    }
    this.setState({ status: AudioRecorderStatus.IDLE })
    const pcm = Pcm(concatenateFloat32Arrays(this.audioPieces))
    this.audioPieces = []
    const sampleRate = Hz(this.audioContext.sampleRate)
    const audioData = pcm.length > 0 ? { pcm, sampleRate } : undefined
    this.fireRecordingCompleteListeners(audioData)

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

  addRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    this.recordingCompleteListeners.push(listener)
  }

  removeRecordingCompleteListener = (listener: RecordingCompleteListener): void => {
    _.remove(this.recordingCompleteListeners, (l) => l === listener)
  }

  protected fireRecordingCompleteListeners = (audioData: Option<AudioData>): void => {
    this.recordingCompleteListeners.forEach((listener) => listener(audioData))
  }
}
