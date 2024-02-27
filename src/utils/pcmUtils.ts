import { Pcm, Seconds } from './types/brandedTypes.ts'

import { DEFAULT_SAMPLE_RATE } from '../types/soundConstants.ts'

export const pcmDurationInSeconds = (pcm: Pcm): Seconds => Seconds(pcm.length / DEFAULT_SAMPLE_RATE)
