import { Pcm, Samples } from './types/brandedTypes.ts'

export const pcmLength = (pcm: Pcm): Samples => Samples(pcm.length)

export const pcmSlice = (pcm: Pcm, start: Samples, finish: Samples): Pcm => Pcm(pcm.slice(start, finish))
