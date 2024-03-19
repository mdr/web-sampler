import { describe, expect, it } from 'vitest'
import { validatePcmSample, validateSoundAudio, validateSoundState } from './SoundStateValidator.ts'
import { makeSound, makeSoundAudio, SoundTestConstants } from '../types/sound.testSupport.ts'
import { SoundState } from './SoundState.ts'
import { makeSoundboard, SoundboardTestConstants } from '../types/soundboard.testSupport.ts'
import { Seconds } from '../utils/types/brandedTypes.ts'

describe('validateSoundState', () => {
  it('finds no issue with a valid sound state', () => {
    const sound = makeSound({ audio: makeSoundAudio() })
    const soundboard = makeSoundboard({ sounds: [sound.id] })
    const soundState: SoundState = { sounds: [sound], soundboards: [soundboard] }

    expect(() => validateSoundState(soundState)).not.toThrow()
  })

  it('throws an appropriate error if a soundboard references a non-existent sound', () => {
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, sounds: [SoundTestConstants.id] })
    const soundState: SoundState = { sounds: [], soundboards: [soundboard] }

    expect(() => validateSoundState(soundState)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Soundboard SoundboardTestConstants.id references missing sound: SoundTestConstants.id]`,
    )
  })

  it('throws an appropriate error if start time is negative', () => {
    const soundAudio = makeSoundAudio({ startTime: Seconds(-1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, soundAudio)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id start time is negative: -1]`,
    )
  })

  it('throws an appropriate error if start time is after finish time', () => {
    const soundAudio = makeSoundAudio({ startTime: Seconds(2), finishTime: Seconds(1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, soundAudio)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id finish time is before start time: 1 < 2]`,
    )
  })

  it('throws an appropriate error if the finish time is after the end of the audio', () => {
    const soundAudio = makeSoundAudio({ pcm: SoundTestConstants.emptyPcm, finishTime: Seconds(100) })
    expect(() => validateSoundAudio(SoundTestConstants.id, soundAudio)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id finish time is after sound duration: 100 > 0]`,
    )
  })

  it('throws an appropriate error if PCM values are out of range -1 <= x <= 1', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1.1)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id sample is out of range: -1.1]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, 1.1)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id sample is out of range: 1.1]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.POSITIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id sample is out of range: Infinity]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NEGATIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id sample is out of range: -Infinity]`,
    )
  })

  it('throws an appropriate error if PCM values are NaN', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NaN)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Sound SoundTestConstants.id sample is not a number]`,
    )
  })

  it('validates PCM values in the correct range', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 0)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 1)).not.toThrow()
  })
})
