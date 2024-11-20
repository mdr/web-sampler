import flushPromises from 'flush-promises'
import { expect } from 'vitest'

import { mockFunction } from '../../utils/mockUtils.testSupport.ts'
import { SoundState } from '../SoundState.ts'
import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { SoundStore } from '../store/SoundStore.ts'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'

export const setUpTest = async (soundState: Partial<SoundState> = {}) => {
  const soundStore = new MemorySoundStore(soundState)
  const library = await makeLoadedSoundLibrary(soundStore)
  const listener = mockFunction<SoundLibraryUpdatedListener>()
  library.addListener(listener)
  return { library, soundStore, listener }
}

export const makeLoadedSoundLibrary = async (soundStore: SoundStore): Promise<SoundLibrary> => {
  const library = new SoundLibrary(soundStore)
  await flushPromises()
  expect(library.isLoading).toBe(false)
  return library
}
