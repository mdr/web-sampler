import { describe, expect, it } from 'vitest'
import { Sound } from '../types/Sound'
import { compareSoundStates } from './SoundsDiff.ts'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'

describe('diffSounds', () => {
  it('correctly identifies sounds to upsert and delete', () => {
    const sound1 = makeSound({ id: SoundTestConstants.id })
    const sound2Version1 = makeSound({ id: SoundTestConstants.id2, name: SoundTestConstants.oldName })
    const sound2Version2 = { ...sound2Version1, name: SoundTestConstants.newName }
    const sound3 = makeSound({ id: SoundTestConstants.id3 })
    const oldSounds: Sound[] = [sound1, sound2Version1]
    const newSounds: Sound[] = [sound2Version2, sound3]
    const oldState = { sounds: oldSounds, soundboards: [] }
    const newState = { sounds: newSounds, soundboards: [] }

    const diff = compareSoundStates(oldState, newState)

    expect(diff.soundsToUpsert).toIncludeSameMembers([sound2Version2, sound3])
    expect(diff.soundIdsToDelete).toEqual([sound1.id])
  })
})
