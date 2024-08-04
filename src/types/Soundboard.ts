import { Brand } from 'effect'
import { SoundId } from './Sound.ts'
import * as uuid from 'uuid'
import { displayCollator } from '../utils/sortUtils.ts'
import { z } from 'zod'
import { assert, Equals } from 'tsafe'
import { KeyboardShortcut } from './KeyboardShortcut.ts'

export type SoundboardId = string & Brand.Brand<'SoundboardId'>

export const SoundboardId = Brand.nominal<SoundboardId>()

export const newSoundboardId = (): SoundboardId => SoundboardId(uuid.v4())

export interface SoundboardTile {
  readonly soundId: SoundId
  readonly shortcut?: KeyboardShortcut
}

export const soundboardTileSchema = z
  .strictObject({ soundId: z.string().transform(SoundId), shortcut: z.string().transform(KeyboardShortcut).optional() })
  .readonly()

assert<Equals<SoundboardTile, z.infer<typeof soundboardTileSchema>>>()

export interface Soundboard {
  readonly id: SoundboardId
  readonly name: string
  readonly tiles: SoundboardTile[]
}

export const soundboardSchema = z
  .strictObject({
    id: z.string().transform(SoundboardId),
    name: z.string(),
    tiles: z.array(soundboardTileSchema),
  })
  .readonly()

assert<Equals<Soundboard, z.infer<typeof soundboardSchema>>>()

export const newSoundboard = (): Soundboard => ({ id: newSoundboardId(), name: '', tiles: [] })

export const getSoundboardDisplayName = (soundboard: Soundboard): string => soundboardNameAsDisplayName(soundboard.name)

export const soundboardNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Soundboard' : name)

export const sortSoundboardsByDisplayName = (soundboards: readonly Soundboard[]): Soundboard[] =>
  [...soundboards].sort((board1, board2) =>
    displayCollator.compare(getSoundboardDisplayName(board1), getSoundboardDisplayName(board2)),
  )

export const removeSoundFromSoundboard = (soundboard: Soundboard, soundId: SoundId): Soundboard => ({
  ...soundboard,
  tiles: soundboard.tiles.filter((tile) => soundId !== tile.soundId),
})
