import { Hz, Samples, Seconds } from '../utils/types/brandedTypes.ts'

export const DEFAULT_SAMPLE_RATE = Hz(48000)

export const secondsToSamples = (seconds: Seconds, sampleRate: Hz): Samples => Samples(Math.floor(seconds * sampleRate))
export const samplesToSeconds = (samples: Samples): Seconds => Seconds(samples / DEFAULT_SAMPLE_RATE)
