import { Brand } from 'effect'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface Sound {
  readonly id: SoundId
  readonly name: string
}
