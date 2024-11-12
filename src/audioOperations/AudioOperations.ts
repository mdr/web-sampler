import { AudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { AudioData } from '../types/AudioData.ts'
import { Hz, Pcm } from '../utils/types/brandedTypes.ts'

export class AudioOperations {
  constructor(private readonly audioContextProvider: AudioContextProvider) {}

  importAudio = async (buffer: ArrayBuffer): Promise<AudioData> => {
    const audioContext = this.audioContextProvider.audioContext
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    const pcm = extractPcm(audioBuffer)
    return { pcm, sampleRate: Hz(audioBuffer.sampleRate) }
  }
}

const extractPcm = (audioBuffer: AudioBuffer): Pcm => {
  if (audioBuffer.numberOfChannels > 1) {
    const leftChannel = Pcm(audioBuffer.getChannelData(0))
    const rightChannel = Pcm(audioBuffer.getChannelData(1))
    return mergeStereoToMono(leftChannel, rightChannel)
  } else {
    return Pcm(audioBuffer.getChannelData(0))
  }
}

const mergeStereoToMono = (leftChannel: Pcm, rightChannel: Pcm): Pcm => {
  const pcmData = new Float32Array(leftChannel.length)
  for (let i = 0; i < leftChannel.length; i++) {
    pcmData[i] = (leftChannel[i] + rightChannel[i]) / 2
  }
  return Pcm(pcmData)
}
