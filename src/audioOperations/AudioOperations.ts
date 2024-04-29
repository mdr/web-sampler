import { AudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { Hz, Pcm } from '../utils/types/brandedTypes.ts'
import { CompletedRecording } from '../audioRecorder/AudioRecorder.ts'

export class AudioOperations {
  constructor(private readonly audioContextProvider: AudioContextProvider) {}

  importAudio = async (buffer: ArrayBuffer): Promise<CompletedRecording> => {
    const audioContext = this.audioContextProvider.audioContext
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    const pcm = Pcm(audioBuffer.getChannelData(0))
    return { pcm, sampleRate: Hz(audioBuffer.sampleRate) }
  }
}
