import { AudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { AudioData } from '../types/AudioData.ts'
import { Hz, Pcm } from '../utils/types/brandedTypes.ts'

export class AudioOperations {
  constructor(private readonly audioContextProvider: AudioContextProvider) {}

  importAudio = async (buffer: ArrayBuffer): Promise<AudioData> => {
    const audioContext = this.audioContextProvider.audioContext
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    let pcm: Pcm
    if (audioBuffer.numberOfChannels > 1) {
      const leftChannel = audioBuffer.getChannelData(0)
      const rightChannel = audioBuffer.getChannelData(1)
      pcm = mergeStereoToMono(leftChannel, rightChannel)
    } else {
      pcm = Pcm(audioBuffer.getChannelData(0))
    }
    return { pcm, sampleRate: Hz(audioBuffer.sampleRate) }
  }
}

const mergeStereoToMono = (leftChannel: Float32Array, rightChannel: Float32Array): Pcm => {
  const pcmData = new Float32Array(leftChannel.length)
  for (let i = 0; i < leftChannel.length; i++) {
    pcmData[i] = (leftChannel[i] + rightChannel[i]) / 2
  }
  return Pcm(pcmData)
}
