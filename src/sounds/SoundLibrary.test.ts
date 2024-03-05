import { describe, expect, it, Mock, vi } from 'vitest'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'
import { newSoundId, Sound } from '../types/Sound.ts'
import { SoundStore } from './SoundStore.ts'

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
    const sound = makeSound({ name: 'Old sound' })
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setName(sound.id, 'New name')

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedSounds = [{ ...sound, name: 'New name' }]
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFunction = <T extends (...args: any) => any>(): Mock<Parameters<T>, ReturnType<T>> => vi.fn()
