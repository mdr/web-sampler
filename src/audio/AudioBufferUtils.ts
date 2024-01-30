import { Option } from '../utils/types/Option.ts'

export class AudioBufferUtils {
  constructor(private readonly audioContext: AudioContext) {}

  combineAudioBuffers = (audioBuffers: AudioBuffer[]): Option<AudioBuffer> => {
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

  cloneAudioBuffer = (originalBuffer: AudioBuffer): AudioBuffer => {
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

  audioBufferFromFloat32Array = (audioData: Float32Array): AudioBuffer => {
    const audioBuffer = this.audioContext.createBuffer(1, audioData.length, this.audioContext.sampleRate)
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(audioData)
    return audioBuffer
  }
}
