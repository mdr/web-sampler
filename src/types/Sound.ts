import { Brand } from 'effect'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface Sound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: Float32Array
}

export const getDisplayName = (sound: Sound): string => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)
