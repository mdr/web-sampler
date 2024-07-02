import { Option } from '../utils/types/Option.ts'
import { SoundboardId } from '../types/Soundboard.ts'
import { useParams } from 'react-router-dom'
import { SoundId } from '../types/Sound.ts'

export const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}
export const useSoundboardIdParam = (): Option<SoundboardId> => {
  const { soundboardId } = useParams()
  return soundboardId === undefined ? undefined : SoundboardId(soundboardId)
}
