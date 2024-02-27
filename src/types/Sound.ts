import { Brand } from 'effect'
import * as uuid from 'uuid'
import { SoundAudio, validateSoundAudio } from './SoundAudio.ts'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface Sound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: SoundAudio
}

export type SoundWithDefiniteAudio = Sound & { readonly audio: SoundAudio }

export const soundHasAudio = (sound: Sound): sound is SoundWithDefiniteAudio => sound.audio !== undefined

export const newSoundId = (): SoundId => SoundId(uuid.v4())

export const newSound = (): Sound => ({ id: newSoundId(), name: '' })

export const getDisplayName = (sound: Sound): string => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export const sortSoundsByDisplayName = (sounds: readonly Sound[]): Sound[] =>
  [...sounds].sort((sound1, sound2) => collator.compare(getDisplayName(sound1), getDisplayName(sound2)))

export const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    validateSoundAudio(sound.id, audio)
  }
}
