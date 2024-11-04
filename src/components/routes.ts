import { ImageId } from '../types/Image.ts'
import { SoundId } from '../types/Sound.ts'
import { SoundboardId } from '../types/Soundboard.ts'

export const Routes = {
  soundsRoute: '/sounds',
  soundboardsRoute: '/soundboards',
  imagesRoute: '/images',
  editSoundRoute: (soundId: SoundId): string => `/sound/${soundId}`,
  editSoundboardRoute: (soundboardId: SoundboardId): string => `/soundboard/${soundboardId}`,
  editImageRoute: (imageId: ImageId): string => `/image/${imageId}`,
}
