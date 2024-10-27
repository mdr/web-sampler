import flushPromises from 'flush-promises'
import { expect } from 'vitest'

import { Image } from '../../types/Image.ts'
import { Sound } from '../../types/Sound.ts'
import { Soundboard } from '../../types/Soundboard.ts'
import { mockFunction } from '../../utils/mockUtils.testSupport.ts'
import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { SoundStore } from '../store/SoundStore.ts'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'

export interface TestSetupParams {
  sounds: readonly Sound[]
  soundboards: readonly Soundboard[]
  images: readonly Image[]
}

export const setUpTest = async ({ sounds = [], soundboards = [], images = [] }: Partial<TestSetupParams> = {}) => {
  const soundStore = new MemorySoundStore(sounds, soundboards, images)
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
