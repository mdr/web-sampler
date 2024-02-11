import { Sound, SoundId } from '../types/Sound.ts'
import { useContext, useEffect, useState } from 'react'
import { SoundLibraryContext } from './SoundLibraryContext.ts'
import { Option } from '../utils/types/Option.ts'
import { SoundLibrary } from './SoundLibrary.ts'

const useSoundLibrary = (): SoundLibrary => {
  const soundLibrary = useContext(SoundLibraryContext)
  if (soundLibrary === undefined) {
    throw new Error('no SoundLibrary available in context')
  }
  return soundLibrary
}

interface SoundLibraryState {
  sounds: readonly Sound[]
  canUndo: boolean
  canRedo: boolean
}

const getSoundLibraryState = (soundLibrary: SoundLibrary): SoundLibraryState => ({
  sounds: soundLibrary.sounds,
  canUndo: soundLibrary.canUndo,
  canRedo: soundLibrary.canRedo,
})

export const useSoundLibraryState = (): SoundLibraryState => {
  const soundLibrary = useSoundLibrary()
  const [state, setState] = useState(getSoundLibraryState(soundLibrary))
  useEffect(() => {
    soundLibrary.addListener(() => setState(getSoundLibraryState(soundLibrary)))
    return () => soundLibrary.removeListener(() => setState(getSoundLibraryState(soundLibrary)))
  }, [soundLibrary, setState])
  return state
}

export const useSounds = (): readonly Sound[] => useSoundLibraryState().sounds

export const useMaybeSound = (id: SoundId): Option<Sound> => {
  const sounds = useSounds()
  return sounds.find((sound) => sound.id === id)
}

export const useSound = (id: SoundId): Sound => {
  const sound = useMaybeSound(id)
  if (sound === undefined) {
    throw new Error(`no sound found with id ${id}`)
  }
  return sound
}

export const useCanUndo = (): boolean => useSoundLibraryState().canUndo

export const useCanRedo = (): boolean => useSoundLibraryState().canRedo

export interface SoundActions {
  newSound(): Sound

  setName(id: SoundId, name: string): void

  setAudio(id: SoundId, audio: Float32Array): void

  deleteSound(id: SoundId): void

  undo(): void

  redo(): void
}

export const useSoundActions = (): SoundActions => useSoundLibrary()
