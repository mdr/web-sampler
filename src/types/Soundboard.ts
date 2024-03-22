import { Brand } from 'effect'
import { SoundId } from './Sound.ts'
import * as uuid from 'uuid'
import { displayCollator } from '../utils/sortUtils.ts'

export type SoundboardId = string & Brand.Brand<'SoundboardId'>

export const SoundboardId = Brand.nominal<SoundboardId>()

export const newSoundboardId = (): SoundboardId => SoundboardId(uuid.v4())

export interface Soundboard {
  readonly id: SoundboardId
  readonly name: string
  readonly sounds: SoundId[]
}

export const newSoundboard = (): Soundboard => ({ id: newSoundboardId(), name: '', sounds: [] })

export const getDisplayName = (soundboard: Soundboard): string =>
  soundboard.name.trim() === '' ? 'Untitled Soundboard' : soundboard.name

export const sortSoundboardsByDisplayName = (soundsboards: readonly Soundboard[]): Soundboard[] =>
  [...soundsboards].sort((board1, board2) => displayCollator.compare(getDisplayName(board1), getDisplayName(board2)))
