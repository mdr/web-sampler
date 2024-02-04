import { Sound, SoundId } from '../types/Sound.ts'
import { useContext } from 'react'
import { ISoundLibrary } from './ISoundLibrary.ts'
import { SoundLibraryContext } from './SoundLibraryContext.ts'
import { Option } from '../utils/types/Option.ts'

const useSoundLibrary = (): ISoundLibrary => {
  const soundLibrary = useContext(SoundLibraryContext)
  if (soundLibrary === undefined) {
    throw new Error('no SoundLibrary available in context')
  }
  return soundLibrary
}

export const useSound = (id: SoundId): Option<Sound> => {
  const soundLibrary = useSoundLibrary()
  return soundLibrary.findSound(id)
}
