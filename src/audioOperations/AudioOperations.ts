import { AudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { Hz, Pcm } from '../utils/types/brandedTypes.ts'

import { AudioData } from '../types/AudioData.ts'

export class AudioOperations {
  constructor(private readonly audioContextProvider: AudioContextProvider) {}

  importAudio = async (buffer: ArrayBuffer): Promise<AudioData> => {
    const audioContext = this.audioContextProvider.audioContext
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    const pcm = Pcm(audioBuffer.getChannelData(0))
    return { pcm, sampleRate: Hz(audioBuffer.sampleRate) }
  }
}
