import { Equals, assert } from 'tsafe'
import { z } from 'zod'

import { Sound, soundSchema } from '../types/Sound.ts'
import { Soundboard, soundboardSchema } from '../types/Soundboard.ts'

export interface SoundState {
  readonly soundboards: readonly Soundboard[]
  readonly sounds: readonly Sound[]
}

export const soundStateSchema = z
  .strictObject({
    soundboards: z.array(soundboardSchema).readonly(),
    sounds: z.array(soundSchema).readonly(),
  })
  .readonly()

assert<Equals<SoundState, z.infer<typeof soundStateSchema>>>()

export const EMPTY_SOUND_STATE: SoundState = { soundboards: [], sounds: [] }

export const makeSoundState = ({ sounds = [], soundboards = [] }: Partial<SoundState> = {}): SoundState => ({
  sounds,
  soundboards,
})
