import { Brand } from 'effect'
import * as uuid from 'uuid'
import { SoundAudio } from './SoundAudio.ts'
import { displayCollator } from '../utils/sortUtils.ts'

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

export const getDisplayName = (sound: Sound): string => getDisplayNameText(sound.name)
export const getDisplayNameText = (name: string): string => (name.trim() === '' ? 'Untitled Sound' : name)

export const sortSoundsByDisplayName = (sounds: readonly Sound[]): Sound[] =>
  [...sounds].sort((sound1, sound2) => displayCollator.compare(getDisplayName(sound1), getDisplayName(sound2)))
