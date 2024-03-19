import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import { DexieSoundStore } from './DexieSoundStore.ts'
import { AppDb } from './AppDb.ts'
import { SoundsDiff } from './SoundsDiff.ts'
import { makeSoundboard, SoundboardTestConstants } from '../types/soundboard.testSupport.ts'

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
    const soundState = await store.getSoundState()
    expect(soundState).toMatchObject({ sounds: [], soundboards: [] })

    const sound = makeSound()
    await store.bulkUpdate(makeSoundsDiff({ soundsToUpsert: [sound], soundIdsToDelete: [] }))
    expect((await store.getSoundState()).sounds).toEqual([sound])

    const updatedSound = { ...sound, name: SoundTestConstants.newName }
    await store.bulkUpdate(makeSoundsDiff({ soundsToUpsert: [updatedSound], soundIdsToDelete: [] }))
    expect((await store.getSoundState()).sounds).toEqual([updatedSound])

    await store.bulkUpdate(makeSoundsDiff({ soundsToUpsert: [], soundIdsToDelete: [updatedSound.id] }))
    expect((await store.getSoundState()).sounds).toEqual([])
  })

  it('should allow soundboards to be added, updated, and removed', async () => {
    const soundState = await store.getSoundState()
    expect(soundState).toMatchObject({ sounds: [], soundboards: [] })

    const soundboard = makeSoundboard()
    await store.bulkUpdate(makeSoundsDiff({ soundboardsToUpsert: [soundboard], soundboardIdsToDelete: [] }))
    expect((await store.getSoundState()).soundboards).toEqual([soundboard])

    const updatedSoundboard = { ...soundboard, name: SoundboardTestConstants.newName }
    await store.bulkUpdate(makeSoundsDiff({ soundboardsToUpsert: [updatedSoundboard], soundboardIdsToDelete: [] }))
    expect((await store.getSoundState()).soundboards).toEqual([updatedSoundboard])

    await store.bulkUpdate(makeSoundsDiff({ soundboardsToUpsert: [], soundboardIdsToDelete: [updatedSoundboard.id] }))
    expect((await store.getSoundState()).soundboards).toEqual([])
  })
})
