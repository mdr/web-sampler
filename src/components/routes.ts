import { ImageId } from '../types/Image.ts'
import { SoundId } from '../types/Sound.ts'
import { SoundboardId } from '../types/Soundboard.ts'

export const Routes = {
  sounds: '/sounds',
  editSound: (soundId: SoundId): string => `/sound/${soundId}`,
  soundboards: '/soundboards',
  editSoundboard: (soundboardId: SoundboardId): string => `/soundboard/${soundboardId}`,
  images: '/images',
  editImage: (imageId: ImageId): string => `/image/${imageId}`,
}
