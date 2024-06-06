import { Brand } from 'effect'
import { SoundId } from './Sound.ts'
import * as uuid from 'uuid'
import { displayCollator } from '../utils/sortUtils.ts'
import { z } from 'zod'
import { assert, Equals } from 'tsafe'

export type SoundboardId = string & Brand.Brand<'SoundboardId'>

export const SoundboardId = Brand.nominal<SoundboardId>()

export const newSoundboardId = (): SoundboardId => SoundboardId(uuid.v4())

export interface Soundboard {
  readonly id: SoundboardId
  readonly name: string
  readonly sounds: SoundId[]
}

export const soundboardSchema = z
  .strictObject({
    id: z.string().transform(SoundboardId),
    name: z.string(),
    sounds: z.array(z.string().transform(SoundId)),
  })
  .readonly()

assert<Equals<Soundboard, z.infer<typeof soundboardSchema>>>()

export const newSoundboard = (): Soundboard => ({ id: newSoundboardId(), name: '', sounds: [] })

export const getSoundboardDisplayName = (soundboard: Soundboard): string => soundboardNameAsDisplayName(soundboard.name)

export const soundboardNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Soundboard' : name)

export const sortSoundboardsByDisplayName = (soundsboards: readonly Soundboard[]): Soundboard[] =>
  [...soundsboards].sort((board1, board2) =>
    displayCollator.compare(getSoundboardDisplayName(board1), getSoundboardDisplayName(board2)),
  )

export const removeSoundFromSoundboard = (soundboard: Soundboard, soundId: SoundId): Soundboard => ({
  ...soundboard,
  sounds: soundboard.sounds.filter((id) => soundId !== id),
})
