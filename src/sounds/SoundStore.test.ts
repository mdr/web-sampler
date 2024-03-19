import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import { DexieSoundStore } from './DexieSoundStore.ts'
import { AppDb } from './AppDb.ts'

describe('SoundStore', () => {
  it.each([
    { name: 'MemorySoundStore', store: new MemorySoundStore() },
    { name: 'DexieSoundStore', store: new DexieSoundStore(new AppDb()) },
  ])('$name: should allow sounds to be added, updated, and removed', async ({ store }) => {
    const soundState = await store.getSoundState()
    expect(soundState).toMatchObject({ sounds: [], soundboards: [] })

    const sound = makeSound()
    await store.bulkUpdate({ soundsToUpsert: [sound], soundIdsToDelete: [] })
    expect((await store.getSoundState()).sounds).toEqual([sound])

    const updatedSound = { ...sound, name: SoundTestConstants.newName }
    await store.bulkUpdate({ soundsToUpsert: [updatedSound], soundIdsToDelete: [] })
    expect((await store.getSoundState()).sounds).toEqual([updatedSound])

    await store.bulkUpdate({ soundsToUpsert: [], soundIdsToDelete: [updatedSound.id] })
    expect((await store.getSoundState()).sounds).toEqual([])
  })
})
