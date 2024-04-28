import { describe, expect, it } from 'vitest'
import { getPlayRegionDuration } from './SoundAudio.ts'
import { makeSoundAudio } from './sound.testSupport.ts'
import { Seconds } from '../utils/types/brandedTypes.ts'
import { secondsToSamples } from './soundConstants.ts'

describe('getPlayRegionDuration', () => {
  it('should return the duration of the play region', () => {
    const audio = makeSoundAudio({
      start: secondsToSamples(Seconds(2)),
      finish: secondsToSamples(Seconds(8)),
    })

    expect(getPlayRegionDuration(audio)).toBe(Seconds(6))
  })
})
