import { Hz, Pcm } from '../utils/types/brandedTypes.ts'

export interface AudioData {
  pcm: Pcm
  sampleRate: Hz
}
