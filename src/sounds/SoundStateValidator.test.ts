import { describe, expect, it } from 'vitest'

import {
  SoundTestConstants,
  makePcm,
  makeSound,
  makeSoundAudio,
  makeSoundWithAudio,
} from '../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard, makeSoundboardTile } from '../types/soundboard.testSupport.ts'
import { Hz, Samples } from '../utils/types/brandedTypes.ts'
import { SoundState, makeSoundState } from './SoundState.ts'
import { validatePcmSample, validateSoundAudio, validateSoundState } from './SoundStateValidator.ts'

describe('validateSoundState', () => {
  it('finds no issue with a valid sound state', () => {
    const sound = makeSoundWithAudio()
    const tile = makeSoundboardTile({ soundId: sound.id })
    const soundboard = makeSoundboard({ tiles: [tile] })
    const soundState: SoundState = makeSoundState({ sounds: [sound], soundboards: [soundboard] })

    expect(() => validateSoundState(soundState)).not.toThrow()
  })

  it('throws an appropriate error if a soundboard references a non-existent sound', () => {
    const tile = makeSoundboardTile({ soundId: SoundTestConstants.id })
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [tile] })
    const soundState: SoundState = makeSoundState({ sounds: [], soundboards: [soundboard] })

    expect(() => validateSoundState(soundState)).toThrowErrorMatchingInlineSnapshot(
      '[SoundboardValidationError: Soundboard SoundboardTestConstants.id references missing sound: SoundTestConstants.id]',
    )
  })

  it('throws an appropriate error if a soundboard references the same sound twice', () => {
    const sound = makeSound({ id: SoundTestConstants.id })
    const tile1 = makeSoundboardTile({ soundId: sound.id })
    const tile2 = makeSoundboardTile({ soundId: sound.id })
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [tile1, tile2] })
    const soundState = makeSoundState({ sounds: [sound], soundboards: [soundboard] })

    expect(() => validateSoundState(soundState)).toThrowErrorMatchingInlineSnapshot(
      '[SoundboardValidationError: Soundboard SoundboardTestConstants.id contains duplicate sound ID: SoundTestConstants.id]',
    )
  })
})

describe('validateSoundAudio', () => {
  it('throws an appropriate error if start time is negative', () => {
    const audio = makeSoundAudio({ start: Samples(-1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id start time is negative: -1]',
    )
  })

  it('throws an appropriate error if start time is after finish time', () => {
    const audio = makeSoundAudio({ start: Samples(2), finish: Samples(1) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id finish time is before start time: 1 < 2]',
    )
  })

  it('throws an appropriate error if the finish time is after the end of the audio', () => {
    const audio = makeSoundAudio({ pcm: SoundTestConstants.emptyPcm, finish: Samples(100) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id finish time is after sound duration: 100 > 0]',
    )
  })

  it('should not throw an error if the finish time is before the end of the audio', () => {
    const pcm = makePcm(Samples(100))
    const audio = makeSoundAudio({ pcm, start: Samples(0), finish: Samples(50) })
    expect(() => validateSoundAudio(SoundTestConstants.id, audio)).not.toThrow()
  })

  it('throws an appropriate error if the sample rate is invalid', () => {
    expect(() =>
      validateSoundAudio(SoundTestConstants.id, makeSoundAudio({ sampleRate: Hz(-1) })),
    ).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample rate is not positive: -1]',
    )
    expect(() =>
      validateSoundAudio(SoundTestConstants.id, makeSoundAudio({ sampleRate: Hz(0) })),
    ).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample rate is not positive: 0]',
    )
    expect(() =>
      validateSoundAudio(SoundTestConstants.id, makeSoundAudio({ sampleRate: Hz(Number.NaN) })),
    ).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample rate is not positive: NaN]',
    )
  })
})

describe('validatePcmSample', () => {
  it('throws an appropriate error if PCM values are out of range -1 <= x <= 1', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1.1)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample is out of range: -1.1]',
    )
    expect(() => validatePcmSample(SoundTestConstants.id, 1.1)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample is out of range: 1.1]',
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.POSITIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample is out of range: Infinity]',
    )
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NEGATIVE_INFINITY)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample is out of range: -Infinity]',
    )
  })

  it('throws an appropriate error if PCM values are NaN', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, Number.NaN)).toThrowErrorMatchingInlineSnapshot(
      '[SoundValidationError: Sound SoundTestConstants.id sample is not a number]',
    )
  })

  it('validates PCM values in the correct range', () => {
    expect(() => validatePcmSample(SoundTestConstants.id, -1)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 0)).not.toThrow()
    expect(() => validatePcmSample(SoundTestConstants.id, 1)).not.toThrow()
  })
})
