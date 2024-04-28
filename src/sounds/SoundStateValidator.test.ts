import { describe, expect, it } from 'vitest'
import { validatePcmSample, validateSoundAudio, validateSoundState } from './SoundStateValidator.ts'
import { makePcm, makeSound, makeSoundAudio, SoundTestConstants } from '../types/sound.testSupport.ts'
import { SoundState } from './SoundState.ts'
import { makeSoundboard, SoundboardTestConstants } from '../types/soundboard.testSupport.ts'
import { Hz, Samples } from '../utils/types/brandedTypes.ts'

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
      `[SoundValidationError: Soundboard SoundboardTestConstants.id references missing sound: SoundTestConstants.id]`,
    )
  })

  it('throws an appropriate error if a soundboard references the same sound twice', () => {
    const sound = makeSound({ id: SoundTestConstants.id })
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, sounds: [sound.id, sound.id] })
    const soundState = { sounds: [sound], soundboards: [soundboard] }

    expect(() => validateSoundState(soundState)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Soundboard SoundboardTestConstants.id contains duplicate sound ID: SoundTestConstants.id]`,
    )
  })
})

describe('validateSoundAudio', () => {
  it('throws an appropriate error if start time is negative', () => {
    const audio = makeSoundAudio({ start: Samples(-1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id start time is negative: -1]`,
    )
  })

  it('throws an appropriate error if start time is after finish time', () => {
    const audio = makeSoundAudio({ start: Samples(2), finish: Samples(1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id finish time is before start time: 1 < 2]`,
    )
  })

  it('throws an appropriate error if the finish time is after the end of the audio', () => {
    const audio = makeSoundAudio({ pcm: SoundTestConstants.emptyPcm, finish: Samples(100) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id finish time is after sound duration: 100 > 0]`,
    )
  })

  it('should not throw an error if the finish time is before the end of the audio', () => {
    const pcm = makePcm(Samples(100))
    const audio = makeSoundAudio({ pcm, start: Samples(0), finish: Samples(50) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).not.toThrow()
  })

  it('throws an appropriate error if the sample rate is negative', () => {
    const audio = makeSoundAudio({ sampleRate: Hz(-1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample rate is not positive: -1]`,
    )
  })
})

describe('validatePcmSample', () => {
  it('throws an appropriate error if PCM values are out of range -1 <= x <= 1', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1.1)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample is out of range: -1.1]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, 1.1)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample is out of range: 1.1]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.POSITIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample is out of range: Infinity]`,
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NEGATIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample is out of range: -Infinity]`,
    )
  })

  it('throws an appropriate error if PCM values are NaN', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NaN)).toThrowErrorMatchingInlineSnapshot(
      `[SoundValidationError: Sound SoundTestConstants.id sample is not a number]`,
    )
  })

  it('validates PCM values in the correct range', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 0)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 1)).not.toThrow()
  })
})
