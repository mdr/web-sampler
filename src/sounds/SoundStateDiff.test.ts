import { describe, expect, it } from 'vitest'

import { Sound } from '../types/Sound'
import { ImageTestConstants, makeImage } from '../types/image.testSupport.ts'
import { SoundTestConstants, makeSound } from '../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard } from '../types/soundboard.testSupport.ts'
import { makeSoundState } from './SoundState.ts'
import { compareSoundStates, isDiffEmpty, makeSoundStateDiff } from './SoundStateDiff.ts'

describe('compareSoundStates', () => {
  it('correctly identifies sounds to upsert and delete', () => {
    const sound1 = makeSound({ id: SoundTestConstants.id })
    const sound2Version1 = makeSound({ id: SoundTestConstants.id2, name: SoundTestConstants.oldName })
    const sound2Version2 = { ...sound2Version1, name: SoundTestConstants.newName }
    const sound3 = makeSound({ id: SoundTestConstants.id3 })
    const oldSounds: Sound[] = [sound1, sound2Version1]
    const newSounds: Sound[] = [sound2Version2, sound3]
    const oldState = makeSoundState({ sounds: oldSounds })
    const newState = makeSoundState({ sounds: newSounds })

    const diff = compareSoundStates(oldState, newState)

    expect(diff.soundsToUpsert).toIncludeSameMembers([sound2Version2, sound3])
    expect(diff.soundIdsToDelete).toEqual([sound1.id])
  })

  it('correctly identifies soundboards to upsert and delete', () => {
    const soundboard1 = makeSoundboard({ id: SoundboardTestConstants.id })
    const soundboard2Version1 = makeSoundboard({
      id: SoundboardTestConstants.id2,
      name: SoundboardTestConstants.oldName,
    })
    const soundboard2Version2 = { ...soundboard2Version1, name: SoundboardTestConstants.newName }
    const soundboard3 = makeSoundboard({ id: SoundboardTestConstants.id3 })
    const oldSoundboards = [soundboard1, soundboard2Version1]
    const newSoundboards = [soundboard2Version2, soundboard3]
    const oldState = makeSoundState({ soundboards: oldSoundboards })
    const newState = makeSoundState({ soundboards: newSoundboards })

    const diff = compareSoundStates(oldState, newState)

    expect(diff.soundboardsToUpsert).toIncludeSameMembers([soundboard2Version2, soundboard3])
    expect(diff.soundboardIdsToDelete).toEqual([soundboard1.id])
  })

  it('correctly identifies images to upsert and delete', () => {
    const image1 = makeImage({ id: ImageTestConstants.id })
    const image2Version1 = makeImage({ id: ImageTestConstants.id2, name: ImageTestConstants.oldName })
    const image2Version2 = { ...image2Version1, name: ImageTestConstants.newName }
    const image3 = makeImage({ id: ImageTestConstants.id3 })
    const oldImages = [image1, image2Version1]
    const newImages = [image2Version2, image3]
    const oldState = makeSoundState({ images: oldImages })
    const newState = makeSoundState({ images: newImages })

    const diff = compareSoundStates(oldState, newState)

    expect(diff.imagesToUpsert).toIncludeSameMembers([image2Version2, image3])
    expect(diff.imageIdsToDelete).toEqual([image1.id])
  })
})

describe('isDiffEmpty', () => {
  it('returns true when all fields are empty', () => {
    expect(
      isDiffEmpty({
        soundsToUpsert: [],
        soundIdsToDelete: [],
        soundboardsToUpsert: [],
        soundboardIdsToDelete: [],
        imagesToUpsert: [],
        imageIdsToDelete: [],
      }),
    ).toBeTrue()
  })

  it('returns false when any field is not empty', () => {
    expect(isDiffEmpty(makeSoundStateDiff({ soundsToUpsert: [makeSound()] }))).toBeFalse()
    expect(isDiffEmpty(makeSoundStateDiff({ soundIdsToDelete: [SoundTestConstants.id] }))).toBeFalse()
    expect(isDiffEmpty(makeSoundStateDiff({ soundboardsToUpsert: [makeSoundboard()] }))).toBeFalse()
    expect(isDiffEmpty(makeSoundStateDiff({ soundboardIdsToDelete: [SoundboardTestConstants.id] }))).toBeFalse()
    expect(isDiffEmpty(makeSoundStateDiff({ imagesToUpsert: [makeImage()] }))).toBeFalse()
    expect(isDiffEmpty(makeSoundStateDiff({ imageIdsToDelete: [ImageTestConstants.id] }))).toBeFalse()
  })
})
