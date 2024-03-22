import { Sound, SoundId } from '../types/Sound.ts'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SoundLibraryContext } from './SoundLibraryContext.ts'
import { Option } from '../utils/types/Option.ts'
import { SoundLibrary } from './SoundLibrary.ts'
import { Pcm, Seconds, Volume } from '../utils/types/brandedTypes.ts'
import { Soundboard, SoundboardId } from '../types/Soundboard.ts'

const useSoundLibrary = (): SoundLibrary => {
  const soundLibrary = useContext(SoundLibraryContext)
  if (soundLibrary === undefined) {
    throw new Error('no SoundLibrary available in context')
  }
  return soundLibrary
}

interface SoundLibraryState {
  sounds: readonly Sound[]
  soundboards: readonly Soundboard[]
  isLoading: boolean
  canUndo: boolean
  canRedo: boolean
}

const getSoundLibraryState = (soundLibrary: SoundLibrary): SoundLibraryState => ({
  sounds: soundLibrary.sounds,
  soundboards: soundLibrary.soundboards,
  isLoading: soundLibrary.isLoading,
  canUndo: soundLibrary.canUndo,
  canRedo: soundLibrary.canRedo,
})

export const useSoundLibraryState = (): SoundLibraryState => {
  const soundLibrary = useSoundLibrary()
  const [state, setState] = useState(getSoundLibraryState(soundLibrary))
  const handleUpdate = useCallback(() => setState(getSoundLibraryState(soundLibrary)), [soundLibrary, setState])
  useEffect(() => {
    soundLibrary.addListener(handleUpdate)
    return () => soundLibrary.removeListener(handleUpdate)
  }, [soundLibrary, handleUpdate])
  return state
}

export const useSounds = (): readonly Sound[] => useSoundLibraryState().sounds

export const useMaybeSound = (id: SoundId): Option<Sound> => useSounds().find((sound) => sound.id === id)

export const useSound = (id: SoundId): Sound => {
  const sound = useMaybeSound(id)
  if (sound === undefined) {
    throw new Error(`no sound found with id ${id}`)
  }
  return sound
}

export const useSoundboards = (): readonly Soundboard[] => useSoundLibraryState().soundboards

export const useMaybeSoundboard = (id: SoundboardId): Option<Soundboard> =>
  useSoundboards().find((soundboard) => soundboard.id === id)

export const useSoundboard = (id: SoundboardId): Soundboard => {
  const soundboard = useMaybeSoundboard(id)
  if (soundboard === undefined) {
    throw new Error(`no soundboard found with id ${id}`)
  }
  return soundboard
}

export const useIsLoading = (): boolean => useSoundLibraryState().isLoading

export const useCanUndo = (): boolean => useSoundLibraryState().canUndo

export const useCanRedo = (): boolean => useSoundLibraryState().canRedo

export interface SoundActions {
  newSound(): Sound

  setName(id: SoundId, name: string): void

  setAudioPcm(id: SoundId, pcm: Pcm): void

  deleteSound(id: SoundId): void

  duplicateSound(id: SoundId): void

  setStartTime(id: SoundId, startTime: Seconds): void

  setFinishTime(id: SoundId, finishTime: Seconds): void

  setVolume(id: SoundId, volume: Option<Volume>): void

  cropAudio(id: SoundId): void

  importSounds(sounds: readonly Sound[]): void

  undo(): void

  redo(): void
}

export const useSoundActions = (): SoundActions => useSoundLibrary()
