import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { makeSound, SoundTestConstants } from '../../types/sound.testSupport.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import { DexieSoundStore } from './DexieSoundStore.ts'
import { AppDb } from './AppDb.ts'
import { SoundsDiff } from '../SoundsDiff.ts'
import { makeSoundboard, SoundboardTestConstants } from '../../types/soundboard.testSupport.ts'

const makeSoundsDiff = ({
  soundsToUpsert = [],
  soundIdsToDelete = [],
  soundboardsToUpsert = [],
  soundboardIdsToDelete = [],
}: Partial<SoundsDiff> = {}) => ({
  soundsToUpsert,
  soundIdsToDelete,
  soundboardsToUpsert,
  soundboardIdsToDelete,
})

describe.each([
  { name: 'MemorySoundStore', store: new MemorySoundStore() },
  { name: 'DexieSoundStore', store: new DexieSoundStore(new AppDb()) },
])('$name', ({ store }) => {
  it('should allow sounds to be added, updated, and removed', async () => {
    expect((await store.getSoundState()).sounds).toEqual([])

    const sound = makeSound()
    const change1 = makeSoundsDiff({ soundsToUpsert: [sound], soundIdsToDelete: [] })
    await store.bulkUpdate(change1)
    expect((await store.getSoundState()).sounds).toEqual([sound])

    const updatedSound = { ...sound, name: SoundTestConstants.newName }
    const change2 = makeSoundsDiff({ soundsToUpsert: [updatedSound], soundIdsToDelete: [] })
    await store.bulkUpdate(change2)
    expect((await store.getSoundState()).sounds).toEqual([updatedSound])

    const change3 = makeSoundsDiff({ soundsToUpsert: [], soundIdsToDelete: [updatedSound.id] })
    await store.bulkUpdate(change3)
    expect((await store.getSoundState()).sounds).toEqual([])
  })

  it('should allow soundboards to be added, updated, and removed', async () => {
    expect((await store.getSoundState()).soundboards).toEqual([])

    const soundboard = makeSoundboard()
    const change1 = makeSoundsDiff({ soundboardsToUpsert: [soundboard], soundboardIdsToDelete: [] })
    await store.bulkUpdate(change1)
    expect((await store.getSoundState()).soundboards).toEqual([soundboard])

    const updatedSoundboard = { ...soundboard, name: SoundboardTestConstants.newName }
    const change2 = makeSoundsDiff({ soundboardsToUpsert: [updatedSoundboard], soundboardIdsToDelete: [] })
    await store.bulkUpdate(change2)
    expect((await store.getSoundState()).soundboards).toEqual([updatedSoundboard])

    const change3 = makeSoundsDiff({ soundboardsToUpsert: [], soundboardIdsToDelete: [updatedSoundboard.id] })
    await store.bulkUpdate(change3)
    expect((await store.getSoundState()).soundboards).toEqual([])
  })
})
