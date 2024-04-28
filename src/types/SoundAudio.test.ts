import { describe, expect, it } from 'vitest'
import { getPlayRegionDuration } from './SoundAudio.ts'
import { makeSoundAudio } from './sound.testSupport.ts'
import { Seconds } from '../utils/types/brandedTypes.ts'
import { DEFAULT_SAMPLE_RATE, secondsToSamples } from './soundConstants.ts'

describe('getPlayRegionDuration', () => {
  it('should return the duration of the play region', () => {
    const audio = makeSoundAudio({
      sampleRate: DEFAULT_SAMPLE_RATE,
      start: secondsToSamples(Seconds(2), DEFAULT_SAMPLE_RATE),
      finish: secondsToSamples(Seconds(8), DEFAULT_SAMPLE_RATE),
    })

    const duration = getPlayRegionDuration(audio)

    expect(duration).toBe(Seconds(6))
  })
})
