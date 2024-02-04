import { Option } from '../utils/types/Option.ts'
import audioBufferToWav from 'audiobuffer-to-wav'

export class AudioBufferUtils {
  constructor(private readonly audioContext: AudioContext) {}

  combineAudioBuffers = (audioBuffers: AudioBuffer[]): Option<AudioBuffer> => {
    if (audioBuffers.length === 0) {
      return undefined
    }
    const totalLength = audioBuffers.reduce((acc, buffer) => acc + buffer.length, 0)

    const numberOfChannels = audioBuffers[0].numberOfChannels
    const combinedBuffer = this.createMonoAudioBuffer(totalLength)

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

  audioBufferFromFloat32Array = (audioData: Float32Array): AudioBuffer => {
    const audioBuffer = this.createMonoAudioBuffer(audioData.length)
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(audioData)
    return audioBuffer
  }

  audioBufferFromArrayBuffer = (arrayBuffer: ArrayBuffer): AudioBuffer =>
    this.audioBufferFromFloat32Array(new Float32Array(arrayBuffer))

  private createMonoAudioBuffer = (length: number): AudioBuffer =>
    this.audioContext.createBuffer(1, length, this.audioContext.sampleRate)

  arrayBufferToWavBlob = (audio: ArrayBuffer): Blob => {
    const audioBuffer = this.audioBufferFromArrayBuffer(audio)
    const wavBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }
}

export const audioBufferToArrayBuffer = (audioBuffer: AudioBuffer): ArrayBuffer => {
  const channelData = audioBuffer.getChannelData(0)
  return new Float32Array(channelData).buffer
}
