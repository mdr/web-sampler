import { ImageId } from '../types/Image.ts'
import { SoundId } from '../types/Sound.ts'
import { SoundboardId } from '../types/Soundboard.ts'

export const editSoundRoute = (soundId: SoundId): string => `/sound/${soundId}`
export const editSoundboardRoute = (soundboardId: SoundboardId): string => `/soundboard/${soundboardId}`
export const editImageRoute = (imageId: ImageId): string => `/image/${imageId}`

export const soundboardsRoute = (): string => '/soundboards'
export const imagesRoute = (): string => '/images'
