import { Brand } from 'effect'
import { SoundId } from './Sound.ts'
import * as uuid from 'uuid'

export type SoundboardId = string & Brand.Brand<'SoundboardId'>

export const SoundboardId = Brand.nominal<SoundboardId>()

export const newSoundboardId = (): SoundboardId => SoundboardId(uuid.v4())

export interface Soundboard {
  readonly id: SoundboardId
  readonly name: string
  readonly sounds: SoundId[]
}
