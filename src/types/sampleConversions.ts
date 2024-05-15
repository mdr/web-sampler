import { Hz, Samples, Seconds } from '../utils/types/brandedTypes.ts'

export const secondsToSamples = (seconds: Seconds, sampleRate: Hz): Samples => Samples(Math.floor(seconds * sampleRate))
export const samplesToSeconds = (samples: Samples, sampleRate: Hz): Seconds => Seconds(samples / sampleRate)
