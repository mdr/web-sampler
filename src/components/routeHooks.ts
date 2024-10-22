import { useParams } from 'react-router-dom'

import { ImageId } from '../types/Image.ts'
import { SoundId } from '../types/Sound.ts'
import { SoundboardId } from '../types/Soundboard.ts'
import { Option } from '../utils/types/Option.ts'

export const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}

export const useSoundboardIdParam = (): Option<SoundboardId> => {
  const { soundboardId } = useParams()
  return soundboardId === undefined ? undefined : SoundboardId(soundboardId)
}

export const useImageIdParam = (): Option<ImageId> => {
  const { imageId } = useParams()
  return imageId === undefined ? undefined : ImageId(imageId)
}
