import { describe, expect, it } from 'vitest'

import { Hz, Pcm, Samples, Seconds } from '../utils/types/brandedTypes.ts'
import {
  getFinishTime,
  getPlayRegionAudioData,
  getPlayRegionDuration,
  getPlayRegionDurationFriendly,
  getStartTime,
  getTotalAudioDuration,
} from './SoundAudio.ts'
import { secondsToSamples } from './sampleConversions.ts'
import { SoundTestConstants, makePcm, makeSoundAudio } from './sound.testSupport.ts'

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

describe('getTotalAudioDuration', () => {
  it('should work', () => {
    const audio = makeSoundAudio({
      pcm: makePcm(Samples(SoundTestConstants.sampleRate)),
      sampleRate: SoundTestConstants.sampleRate,
    })

    const duration = getTotalAudioDuration(audio)

    expect(duration).toBe(Seconds(1))
  })
})

describe('getPlayRegionDurationFriendly', () => {
  it('should describe the play duration as a human-readable string', () => {
    const audio = makeSoundAudio({
      pcm: makePcm(Samples(SoundTestConstants.sampleRate)),
      start: Samples(0),
      finish: Samples(SoundTestConstants.sampleRate),
      sampleRate: SoundTestConstants.sampleRate,
    })

    const duration = getPlayRegionDurationFriendly(audio)

    expect(duration).toBe('1 second')
  })
})

describe('getPlayRegionAudioData', () => {
  it('should extract the subset of PCM between start and finish', () => {
    const audio = makeSoundAudio({
      pcm: Pcm(new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])),
      start: Samples(2),
      finish: Samples(8),
      sampleRate: SoundTestConstants.sampleRate,
    })

    const audioData = getPlayRegionAudioData(audio)

    expect(audioData).toEqual({
      pcm: Pcm(new Float32Array([2, 3, 4, 5, 6, 7])),
      sampleRate: SoundTestConstants.sampleRate,
    })
  })
})

describe('getStartTime', () => {
  it('should return the start time in seconds', () => {
    const audio = makeSoundAudio({
      start: Samples(200),
      sampleRate: Hz(100),
    })

    const time = getStartTime(audio)

    expect(time).toBe(Seconds(2))
  })
})

describe('getFinishTime', () => {
  it('should return the finish time in seconds', () => {
    const audio = makeSoundAudio({
      finish: Samples(200),
      sampleRate: Hz(100),
    })

    const time = getFinishTime(audio)

    expect(time).toBe(Seconds(2))
  })
})
