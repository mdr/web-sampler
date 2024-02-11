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

  pcmToWavBlob = (pcm: Pcm): Blob => {
    const audioBuffer = this.pcmToAudioBuffer(pcm)
    const wavBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }
}
