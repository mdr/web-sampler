import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { DexieSoundStore } from './DexieSoundStore.ts'
import { AppDb } from './AppDb.ts'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'

describe('DexieSoundStore', () => {
  it('should allow sounds to be added, updated, and removed', async () => {
    const store = new DexieSoundStore(new AppDb())
    const soundState = await store.getSoundState()
    expect(soundState).toMatchObject({ sounds: [], soundboards: [] })

    const sound = makeSound()
    await store.bulkUpdate([sound], [])
    expect((await store.getSoundState()).sounds).toEqual([sound])

    const updatedSound = { ...sound, name: SoundTestConstants.newName }
    await store.bulkUpdate([updatedSound], [])
    expect((await store.getSoundState()).sounds).toEqual([updatedSound])
    
    await store.bulkUpdate([], [sound.id])
    expect((await store.getSoundState()).sounds).toEqual([])
  })
})
