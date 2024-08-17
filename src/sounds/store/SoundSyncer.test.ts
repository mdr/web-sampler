import flushPromises from 'flush-promises'
import { describe, expect, it } from 'vitest'

import { SoundTestConstants, makeSound } from '../../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard } from '../../types/soundboard.testSupport.ts'
import { EMPTY_SOUND_STATE, makeSoundState } from '../SoundState.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import { SoundSyncer } from './SoundSyncer.ts'

describe('SoundSyncer', () => {
  it('should write modifications to a sound store as sounds are changed', async () => {
    const soundStore = new MemorySoundStore()
    const soundSyncer = new SoundSyncer(soundStore)
    soundSyncer.soundsLoaded(EMPTY_SOUND_STATE)
    const sound1 = makeSound()
    const sound2 = makeSound({ name: SoundTestConstants.oldName })
    soundSyncer.soundsUpdated(makeSoundState({ sounds: [sound1, sound2] }))
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound1, sound2])

    const sound2Updated = { ...sound2, name: SoundTestConstants.newName }
    const sound3 = makeSound()
    soundSyncer.soundsUpdated(makeSoundState({ sounds: [sound2Updated, sound3] }))
    await flushPromises()

    expect(soundStore.sounds).toIncludeSameMembers([sound2Updated, sound3])
  })

  it('should write modifications to a sound store as soundboards are changed', async () => {
    const soundStore = new MemorySoundStore()
    const soundSyncer = new SoundSyncer(soundStore)
    soundSyncer.soundsLoaded(EMPTY_SOUND_STATE)
    const soundboard1 = makeSoundboard()
    const soundboard2 = makeSoundboard({ name: SoundboardTestConstants.oldName })
    soundSyncer.soundsUpdated(makeSoundState({ soundboards: [soundboard1, soundboard2] }))
    await flushPromises()

    expect(soundStore.soundboards).toIncludeSameMembers([soundboard1, soundboard2])

    const soundboard2Updated = { ...soundboard2, name: SoundboardTestConstants.newName }
    const soundboard3 = makeSoundboard()
    soundSyncer.soundsUpdated(makeSoundState({ soundboards: [soundboard2Updated, soundboard3] }))
    await flushPromises()

    expect(soundStore.soundboards).toIncludeSameMembers([soundboard2Updated, soundboard3])
  })
})
