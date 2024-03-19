import { Brand } from 'effect'
import { SoundId } from './Sound.ts'

export type SoundboardId = string & Brand.Brand<'SoundboardId'>

export const SoundboardId = Brand.nominal<SoundboardId>()

export interface Soundboard {
  readonly id: SoundboardId
  readonly name: string
  readonly sounds: SoundId[]
}
