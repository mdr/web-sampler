import { describe, expect, it } from 'vitest'
import { makeSound, makeSoundWithAudio, SoundTestConstants } from './sound.testSupport.ts'
import { getSoundDisplayName, sortSoundsByDisplayName, soundHasAudio } from './Sound.ts'

describe('getSoundDisplayName', () => {
  it('should return the sound name if present', () => {
    const sound = makeSound({ name: SoundTestConstants.name })

    const displayName = getSoundDisplayName(sound)

    expect(displayName).toEqual(SoundTestConstants.name)
  })

  it('should return "Untitled Sound" if the sound has no name', () => {
    const sound = makeSound({ name: '' })

    const displayName = getSoundDisplayName(sound)

    expect(displayName).toEqual('Untitled Sound')
  })
})

describe('sortSoundsByDisplayName', () => {
  it('should sort sounds by name', () => {
    const sound1 = makeSound({ name: '' })
    const sound2 = makeSound({ name: 'A' })
    const sound3 = makeSound({ name: 'Z' })

    const sortedSounds = sortSoundsByDisplayName([sound1, sound2, sound3])

    expect(sortedSounds).toEqual([sound2, sound1, sound3])
  })
})

describe('soundHasAudio', () => {
  it('should work', () => {
    expect(soundHasAudio(makeSoundWithAudio())).toBeTrue()
    expect(soundHasAudio(makeSound({ audio: undefined }))).toBeFalse()
  })
})
