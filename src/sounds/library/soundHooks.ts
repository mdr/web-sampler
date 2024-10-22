import { useCallback, useContext, useEffect, useState } from 'react'

import { Image, ImageId } from '../../types/Image.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId, SoundboardTile } from '../../types/Soundboard.ts'
import { Option } from '../../utils/types/Option.ts'
import { SoundActions } from './SoundActions.ts'
import { SoundLibrary } from './SoundLibrary.ts'
import { SoundLibraryContext } from './SoundLibraryContext.ts'

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

export interface SoundboardAndSounds {
  soundboard: Soundboard
  tiles: readonly SoundboardTileWithSound[]
}

export interface SoundboardTileWithSound extends SoundboardTile {
  readonly sound: Sound
}

export const useSoundboardAndSounds = (soundboardId: SoundboardId): SoundboardAndSounds => {
  const soundboard = useSoundboard(soundboardId)
  const allSounds = useSounds()
  const getSound = (soundId: SoundId): Sound => {
    const sound = allSounds.find((sound) => sound.id === soundId)
    if (sound === undefined) {
      throw new Error(`no sound found with id ${soundId}`)
    }
    return sound
  }
  const addSound = (tile: SoundboardTile): SoundboardTileWithSound => ({
    ...tile,
    sound: getSound(tile.soundId),
  })
  const tiles = soundboard.tiles.map(addSound)
  return { soundboard, tiles }
}

export const useIsLoading = (): boolean => useSoundLibraryState().isLoading

export const useCanUndo = (): boolean => useSoundLibraryState().canUndo

export const useCanRedo = (): boolean => useSoundLibraryState().canRedo

export const useSoundActions = (): SoundActions => useSoundLibrary()

export const useImages = (): readonly Image[] => []

export const useMaybeImage = (id: ImageId): Option<Image> => useImages().find((image) => image.id === id)

export const useImage = (id: ImageId): Image => {
  const image = useMaybeImage(id)
  if (image === undefined) {
    throw new Error(`no image found with id ${id}`)
  }
  return image
}
