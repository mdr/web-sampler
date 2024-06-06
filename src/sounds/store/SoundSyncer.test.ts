import { describe, expect, it } from 'vitest'
import { SoundSyncer } from './SoundSyncer.ts'
import { makeSound, SoundTestConstants } from '../../types/sound.testSupport.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'

describe('SoundSyncer', () => {
  it('should write modifications to a sound store as sounds are changed', async () => {
    const soundStore = new MemorySoundStore()
    const soundSyncer = new SoundSyncer(soundStore)
    soundSyncer.soundsLoaded({ sounds: [], soundboards: [] })
    const sound1 = makeSound()
    const sound2 = makeSound({ name: SoundTestConstants.oldName })
    soundSyncer.soundsUpdated({ sounds: [sound1, sound2], soundboards: [] })
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound1, sound2])

    const sound2Updated = { ...sound2, name: SoundTestConstants.newName }
    const sound3 = makeSound()
    soundSyncer.soundsUpdated({ sounds: [sound2Updated, sound3], soundboards: [] })
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound2Updated, sound3])
  })
})
