import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'

import { Sound } from '../../types/Sound.ts'
import { SoundTestConstants, makeSound } from '../../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard } from '../../types/soundboard.testSupport.ts'
import { makeSoundStateDiff } from '../SoundStateDiff.ts'
import { AppDb } from './AppDb.ts'
import { DexieSoundStore } from './DexieSoundStore.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'

describe.each([
  { name: 'MemorySoundStore', store: new MemorySoundStore() },
  { name: 'DexieSoundStore', store: new DexieSoundStore(new AppDb()) },
])('$name', ({ store }) => {
  it('should allow sounds to be added, updated, and removed', async () => {
    expect((await store.getSoundState()).sounds).toEqual([])

    const sound = makeSound()
    const change1 = makeSoundStateDiff({ soundsToUpsert: [sound], soundIdsToDelete: [] })
    await store.bulkUpdate(change1)
    expect((await store.getSoundState()).sounds).toEqual([sound])

    const updatedSound = { ...sound, name: SoundTestConstants.newName }
    const change2 = makeSoundStateDiff({ soundsToUpsert: [updatedSound], soundIdsToDelete: [] })
    await store.bulkUpdate(change2)
    expect((await store.getSoundState()).sounds).toEqual([updatedSound])

    const change3 = makeSoundStateDiff({ soundsToUpsert: [], soundIdsToDelete: [updatedSound.id] })
    await store.bulkUpdate(change3)
    expect((await store.getSoundState()).sounds).toEqual([])
  })

  it('should allow soundboards to be added, updated, and removed', async () => {
    expect((await store.getSoundState()).soundboards).toEqual([])

    const soundboard = makeSoundboard()
    const change1 = makeSoundStateDiff({ soundboardsToUpsert: [soundboard], soundboardIdsToDelete: [] })
    await store.bulkUpdate(change1)
    expect((await store.getSoundState()).soundboards).toEqual([soundboard])

    const updatedSoundboard = { ...soundboard, name: SoundboardTestConstants.newName }
    const change2 = makeSoundStateDiff({ soundboardsToUpsert: [updatedSoundboard], soundboardIdsToDelete: [] })
    await store.bulkUpdate(change2)
    expect((await store.getSoundState()).soundboards).toEqual([updatedSoundboard])

    const change3 = makeSoundStateDiff({ soundboardsToUpsert: [], soundboardIdsToDelete: [updatedSoundboard.id] })
    await store.bulkUpdate(change3)
    expect((await store.getSoundState()).soundboards).toEqual([])
  })

  it('should validate data shape on reading from the store', async () => {
    const badSound = { ...makeSound(), foo: 42 } as Sound
    await store.bulkUpdate(makeSoundStateDiff({ soundsToUpsert: [badSound] }))

    await expect(store.getSoundState()).rejects.toThrowError()
  })
})
