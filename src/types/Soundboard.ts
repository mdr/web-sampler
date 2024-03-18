import { Brand } from 'effect'
import { SoundId } from './Sound.ts'

export type SoundBoardId = string & Brand.Brand<'SoundBoardId'>

export const SoundBoardId = Brand.nominal<SoundBoardId>()

export interface Soundboard {
  readonly id: SoundBoardId
  readonly name: string
  readonly sounds: SoundId[]
}
