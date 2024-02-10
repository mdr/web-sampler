import { Sound, SoundId } from '../types/Sound.ts'
import { useCallback, useContext, useEffect, useState } from 'react'
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

export const useSounds = (): readonly Sound[] => {
  const soundLibrary = useSoundLibrary()
  const [sounds, setSounds] = useState<readonly Sound[]>(soundLibrary.sounds)
  const handleSoundsChanged = useCallback((newSounds: readonly Sound[]) => setSounds(newSounds), [setSounds])
  useEffect(() => {
    soundLibrary.addListener(handleSoundsChanged)
    return () => soundLibrary.removeListener(handleSoundsChanged)
  }, [soundLibrary, handleSoundsChanged])
  return sounds
}

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

export interface SoundActions {
  newSound(): Sound

  setName(id: SoundId, name: string): void

  setAudio(id: SoundId, audio: Float32Array): void

  deleteSound(id: SoundId): void
}

export const useSoundActions = (): SoundActions => useSoundLibrary()
