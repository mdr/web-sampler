import audioBufferToWav from 'audiobuffer-to-wav'
import { Pcm } from '../utils/types/brandedTypes.ts'

export class AudioBufferUtils {
  constructor(private readonly audioContext: AudioContext) {}

  pcmToAudioBuffer = (pcm: Pcm): AudioBuffer => {
    const audioBuffer = this.audioContext.createBuffer(1, pcm.length, this.audioContext.sampleRate)
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(pcm)
    return audioBuffer
  }

  pcmToWavArrayBuffer = (pcm: Pcm): ArrayBuffer => {
    const audioBuffer = this.pcmToAudioBuffer(pcm)
    return audioBufferToWav(audioBuffer)
  }

  pcmToWavBlob = (pcm: Pcm): Blob => {
    const wavBuffer = this.pcmToWavArrayBuffer(pcm)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }
}