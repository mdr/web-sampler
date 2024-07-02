import { SoundId } from '../types/Sound.ts'
import { SoundboardId } from '../types/Soundboard.ts'

export const editSoundRoute = (soundId: SoundId): string => `/sound/${soundId}`
export const editSoundboardRoute = (soundboardId: SoundboardId): string => `/soundboard/${soundboardId}`
export const soundboardsRoute = (): string => '/soundboards'
