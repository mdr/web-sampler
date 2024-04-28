import { Pcm, Samples, Seconds } from './types/brandedTypes.ts'

import { DEFAULT_SAMPLE_RATE } from '../types/soundConstants.ts'

export const pcmDurationInSeconds = (pcm: Pcm): Seconds => Seconds(pcm.length / DEFAULT_SAMPLE_RATE)

export const pcmDurationInSamples = (pcm: Pcm): Samples => Samples(pcm.length)

export const pcmSlice = (pcm: Pcm, start: Samples, finish: Samples): Pcm => Pcm(pcm.slice(start, finish))
