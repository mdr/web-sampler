import { describe, expect, it } from 'vitest'
import { getPlayRegionDuration } from './SoundAudio.ts'
import { makeSoundAudio, SoundTestConstants } from './sound.testSupport.ts'
import { Seconds } from '../utils/types/brandedTypes.ts'
import { secondsToSamples } from './sampleConversions.ts'

describe('getPlayRegionDuration', () => {
  it('should return the duration of the play region', () => {
    const audio = makeSoundAudio({
      sampleRate: SoundTestConstants.sampleRate,
      start: secondsToSamples(Seconds(2), SoundTestConstants.sampleRate),
      finish: secondsToSamples(Seconds(8), SoundTestConstants.sampleRate),
    })

    const duration = getPlayRegionDuration(audio)

    expect(duration).toBe(Seconds(6))
  })
})
