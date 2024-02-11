import { Brand } from 'effect'
import * as uuid from 'uuid'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface SoundAudio {
  readonly pcm: Float32Array
}

export interface Sound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: SoundAudio
}

export const newSound = (): Sound => {
  const id = SoundId(uuid.v4())
  return { id, name: '' }
}

export const getDisplayName = (sound: Sound): string => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)
