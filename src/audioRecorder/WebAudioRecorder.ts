import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from './AudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'
import { CAPTURING_AUDIO_WORKLET_NAME, STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'
import { AudioContextProvider } from './AudioContextProvider.ts'
import { AbstractAudioRecorder } from './AbstractAudioRecorder.ts'
import { concatenateFloat32Arrays } from '../utils/utils.ts'
import _ from 'lodash'

import workletUrl from './CapturingAudioWorkletProcessor?worker&url'
import { Pcm } from '../utils/types/brandedTypes.ts'
import { DEFAULT_SAMPLE_RATE } from '../types/soundConstants.ts'

export class WebAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  private mediaStream: Option<MediaStream> = undefined
  private getVolume: Option<() => number> = undefined
  private audioPieces: Float32Array[] = []
  private captureAudioWorkletNode: Option<AudioWorkletNode> = undefined
  private source: Option<MediaStreamAudioSourceNode> = undefined

  constructor(private readonly audioContextProvider: AudioContextProvider) {
    super()
  }

  private get audioContext(): AudioContext {
    return this.audioContextProvider.audioContext
  }

  private handleStreamInactive = () => {
    this.stopRecording()
  }

  get volume(): number {
    return this.getVolume?.() ?? 0
  }

  private handleWorkletMessage = (event: MessageEvent<Float32Array>) => {
    this.audioPieces.push(event.data)
  }

  startRecording = async (): Promise<StartRecordingOutcome> => {
    if (this.state !== AudioRecorderState.IDLE) {
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
      return average(dataArray) ?? 0
    }

    const captureAudioWorkletNode = new AudioWorkletNode(this.audioContext, CAPTURING_AUDIO_WORKLET_NAME)
    source.connect(captureAudioWorkletNode)
    captureAudioWorkletNode.port.onmessage = this.handleWorkletMessage
    this.captureAudioWorkletNode = captureAudioWorkletNode
    return StartRecordingOutcome.SUCCESS
  }

  stopRecording = (): void => {
    if (this.state !== AudioRecorderState.RECORDING) {
      return
    }
    this.setState(AudioRecorderState.IDLE)
    const combinedAudio = Pcm(concatenateFloat32Arrays(this.audioPieces))
    this.audioPieces = []
    const completedRecording =
      combinedAudio.length > 0 ? { pcm: combinedAudio, sampleRate: DEFAULT_SAMPLE_RATE } : undefined
    this.fireRecordingCompleteListeners(completedRecording)

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

const average = (array: Uint8Array): Option<number> => {
  if (array.length === 0) {
    return undefined
  }
  return _.sum(array) / array.length
}
