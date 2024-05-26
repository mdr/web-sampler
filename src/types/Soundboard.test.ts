import { describe, expect, it } from 'vitest'
import { removeSoundFromSoundboard } from './Soundboard.ts'
import { SoundTestConstants } from './sound.testSupport.ts'
import { makeSoundboard } from './soundboard.testSupport.ts'

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
