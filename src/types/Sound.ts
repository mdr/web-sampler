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

export const newSound = (): Sound => {
  const id = SoundId(uuid.v4())
  return { id, name: '' }
}

export const getDisplayName = (sound: Sound): string => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export const sortSoundsByDisplayName = (sounds: readonly Sound[]): Sound[] =>
  [...sounds].sort((sound1, sound2) => collator.compare(getDisplayName(sound1), getDisplayName(sound2)))

export const DEFAULT_SAMPLE_RATE = 48000

export const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    validateSoundAudio(sound.id, audio)
  }
}
