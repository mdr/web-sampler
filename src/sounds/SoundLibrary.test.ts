import { describe, expect, it, test } from 'vitest'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'
import { makeSound, makeSoundAudio, SoundTestConstants } from '../types/sound.testSupport.ts'
import { newSoundId, Sound } from '../types/Sound.ts'
import { SoundStore } from './SoundStore.ts'
import { mockFunction } from '../utils/mockUtils.testSupport.ts'
import { Volume } from '../utils/types/brandedTypes.ts'

describe('SoundLibrary', () => {
  it('should load sounds from the store on creation', async () => {
    const sounds = [makeSound()]
    const soundStore = new MemorySoundStore(sounds)
    const library = new SoundLibrary(soundStore)
    expect(library.isLoading).toBe(true)
    expect(library.sounds).toEqual([])

    await flushPromises()

    expect(library.isLoading).toBe(false)
    expect(library.sounds).toIncludeSameMembers(sounds)
  })

  it('should not allow sounds to be modified while still loading', async () => {
    const sound = makeSound()
    const soundStore = new MemorySoundStore([sound])
    const library = new SoundLibrary(soundStore)
    expect(library.isLoading).toBe(true)

    expect(library.newSound).toThrowError()
    expect(() => library.deleteSound(sound.id)).toThrowError()
    expect(() => library.setName(sound.id, SoundTestConstants.name)).toThrowError()
  })

  it('should allow sounds to be queried', async () => {
    const sound = makeSound()
    const library = await makeLoadedSoundLibrary(new MemorySoundStore([sound]))

    expect(library.findSound(sound.id)).toEqual(sound)
    expect(library.findSound(newSoundId())).toBeUndefined()
  })

  it('should allow a new sound to be added', async () => {
    const { library, soundStore, listener } = await setUpTest()

    const sound = library.newSound()

    expect(sound.name).toEqual('')
    expect(sound.audio).toBeUndefined()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([sound])
    await flushPromises()
    expect(soundStore.sounds).toEqual([sound])
  })

  it('should allow a sound to be deleted', async () => {
    const sound = makeSound()
    const { library, soundStore, listener } = await setUpTest([sound])

    library.deleteSound(sound.id)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([])
    await flushPromises()
    expect(soundStore.sounds).toEqual([])
  })

  it('should allow a sound name to be changed', async () => {
    const sound = makeSound({ name: SoundTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setName(sound.id, SoundTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedSounds = [{ ...sound, name: SoundTestConstants.newName }]
    expect(library.sounds).toEqual(updatedSounds)
    await flushPromises()
    expect(soundStore.sounds).toEqual(updatedSounds)
  })

  it('should allow sounds to be imported', async () => {
    const oldSounds = [makeSound()]
    const { library, soundStore, listener } = await setUpTest(oldSounds)
    const newSounds = [makeSound()]

    library.importSounds(newSounds)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual(newSounds)
    await flushPromises()
    expect(soundStore.sounds).toEqual(newSounds)
  })

  it('should allow the volume of a sound to be set', async () => {
    const sound = makeSound({ audio: makeSoundAudio({ volume: Volume(1) }) })
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setVolume(sound.id, Volume(0.5))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).audio?.volume).toEqual(Volume(0.5))
    await flushPromises()
    expect(soundStore.sounds[0].audio?.volume).toEqual(Volume(0.5))
  })

  it('should allow undo and redo', async () => {
    const sound = makeSound({ name: SoundTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: false })

    library.setName(sound.id, SoundTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    await flushPromises()
    expect(soundStore.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(library.sounds).toEqual([sound])
    await flushPromises()
    expect(soundStore.sounds).toEqual([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.redo()

    expect(listener).toHaveBeenCalledTimes(3)
    expect(library.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    await flushPromises()
    expect(soundStore.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
  })

  test('redo stack should be cleared when a new action is performed', async () => {
    const sound = makeSound({ name: 'Name 1' })
    const { library } = await setUpTest([sound])

    library.setName(sound.id, 'Name 2')
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 2' }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()
    expect(library.sounds).toEqual([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.setName(sound.id, 'Name 3')
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 3' }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.redo()
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 3' }])
  })
})

const setUpTest = async (initialSounds: Sound[] = []) => {
  const soundStore = new MemorySoundStore(initialSounds)
  const library = await makeLoadedSoundLibrary(soundStore)
  const listener = mockFunction<SoundLibraryUpdatedListener>()
  library.addListener(listener)
  return { library, soundStore, listener }
}

const makeLoadedSoundLibrary = async (soundStore: SoundStore): Promise<SoundLibrary> => {
  const library = new SoundLibrary(soundStore)
  await flushPromises()
  expect(library.isLoading).toBe(false)
  return library
}
