import { describe, expect, it } from 'vitest'
import { SoundSyncer } from './SoundSyncer.ts'
import { makeSound } from '../types/sound.testSupport.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'

describe('SoundSyncer', () => {
  it('should be tested', async () => {
    const soundStore = new MemorySoundStore()
    const soundSyncer = new SoundSyncer(soundStore)
    soundSyncer.soundsLoaded([])
    const sound1 = makeSound()
    const sound2 = makeSound({ name: 'Old name' })
    soundSyncer.soundsUpdated([sound1, sound2])
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound1, sound2])

    const sound2Updated = { ...sound2, name: 'New name' }
    const sound3 = makeSound()
    soundSyncer.soundsUpdated([sound2Updated, sound3])
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound2Updated, sound3])
  })
})
