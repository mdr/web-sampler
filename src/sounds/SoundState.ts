import { Equals, assert } from 'tsafe'
import { z } from 'zod'

import { Image, imageSchema } from '../types/Image.ts'
import { Sound, soundSchema } from '../types/Sound.ts'
import { Soundboard, soundboardSchema } from '../types/Soundboard.ts'

export interface SoundState {
  readonly soundboards: readonly Soundboard[]
  readonly sounds: readonly Sound[]
  readonly images: readonly Image[]
}

export const soundStateSchema = z
  .strictObject({
    soundboards: z.array(soundboardSchema).readonly(),
    sounds: z.array(soundSchema).readonly(),
    images: z.array(imageSchema).readonly(),
  })
  .readonly()

assert<Equals<SoundState, z.infer<typeof soundStateSchema>>>()

export const EMPTY_SOUND_STATE: SoundState = { soundboards: [], sounds: [], images: [] }

export const makeSoundState = ({
  sounds = [],
  soundboards = [],
  images = [],
}: Partial<SoundState> = {}): SoundState => ({
  sounds,
  soundboards,
  images,
})
