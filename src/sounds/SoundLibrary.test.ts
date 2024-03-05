import { describe, expect, it, Mock, vi } from 'vitest'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'
import { makeSound, SoundTestConstants } from '../types/sound.testSupport.ts'
import { newSoundId } from '../types/Sound.ts'
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
    const soundStore = new MemorySoundStore()
    const library = await makeLoadedSoundLibrary(soundStore)
    const listener = mockFunction<SoundLibraryUpdatedListener>()
    library.addListener(listener)

    const sound = library.newSound()
    await flushPromises()
    
    expect(soundStore.sounds).toEqual([sound])
    expect(sound.name).toEqual('')
    expect(sound.audio).toBeUndefined()
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

const makeLoadedSoundLibrary = async (soundStore: SoundStore): Promise<SoundLibrary> => {
  const library = new SoundLibrary(soundStore)
  await flushPromises()
  expect(library.isLoading).toBe(false)
  return library
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFunction = <T extends (...args: any) => any>(): Mock<Parameters<T>, ReturnType<T>> => vi.fn()
