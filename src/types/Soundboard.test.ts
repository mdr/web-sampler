import { describe, expect, it } from 'vitest'
import { getSoundboardDisplayName, removeSoundFromSoundboard, sortSoundboardsByDisplayName } from './Soundboard.ts'
import { SoundTestConstants } from './sound.testSupport.ts'
import { makeSoundboard, SoundboardTestConstants } from './soundboard.testSupport.ts'

describe('removeSoundFromSoundboard', () => {
  it('should remove the sound from the soundboard if present', () => {
    const soundboard = makeSoundboard({ sounds: [SoundTestConstants.id] })
    const updatedSoundboard = removeSoundFromSoundboard(soundboard, SoundTestConstants.id)
    expect(updatedSoundboard.sounds).toEqual([])
  })

  it('does nothing if the sound is not in the soundboard', () => {
    const soundboard = makeSoundboard({ sounds: [SoundTestConstants.id] })
    const updatedSoundboard = removeSoundFromSoundboard(soundboard, SoundTestConstants.id2)
    expect(updatedSoundboard.sounds).toEqual([SoundTestConstants.id])
  })
})

describe('getSoundboardDisplayName', () => {
  it('should return the soundboard name if present', () => {
    const soundboard = makeSoundboard({ name: SoundboardTestConstants.name })

    const displayName = getSoundboardDisplayName(soundboard)

    expect(displayName).toEqual(SoundboardTestConstants.name)
  })

  it('should return "Untitled Soundboard" if the soundboard has no name', () => {
    const soundboard = makeSoundboard({ name: '' })

    const displayName = getSoundboardDisplayName(soundboard)

    expect(displayName).toEqual('Untitled Soundboard')
  })
})

describe('sortSoundboardsByDisplayName', () => {
  it('should sort soundboards by name', () => {
    const soundboard1 = makeSoundboard({ name: '' })
    const soundboard2 = makeSoundboard({ name: 'A' })
    const soundboard3 = makeSoundboard({ name: 'Z' })

    const sortedSoundboards = sortSoundboardsByDisplayName([soundboard1, soundboard2, soundboard3])

    expect(sortedSoundboards).toEqual([soundboard2, soundboard1, soundboard3])
  })
})
