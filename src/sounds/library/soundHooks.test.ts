import { describe, expect, it } from 'vitest'

import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { makeLoadedSoundLibrary } from './SoundLibrary.testSupport.ts'
import { getSoundLibraryState, getSoundboardsContainingSound } from './soundHooks.ts'

describe('getSoundboardsContainingSound', () => {
  it('should return all soundboards that contain the given sound', async () => {
    const soundLibrary = await makeLoadedSoundLibrary(new MemorySoundStore())
    const sound1 = soundLibrary.newSound()
    const sound2 = soundLibrary.newSound()
    const soundboard1 = soundLibrary.newSoundboard()
    soundLibrary.addSoundToSoundboard(soundboard1.id, sound1.id)
    const soundboard2 = soundLibrary.newSoundboard()
    soundLibrary.addSoundToSoundboard(soundboard2.id, sound1.id)
    soundLibrary.addSoundToSoundboard(soundboard2.id, sound2.id)
    const soundboard3 = soundLibrary.newSoundboard()
    soundLibrary.addSoundToSoundboard(soundboard3.id, sound2.id)
    const state = getSoundLibraryState(soundLibrary)

    const soundboards = getSoundboardsContainingSound(state, sound1.id)

    expect(soundboards.map(({ id }) => id)).toIncludeSameMembers([soundboard1.id, soundboard2.id])
  })
})
