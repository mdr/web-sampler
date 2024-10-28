import { Brand } from 'effect'
import { Equals, assert } from 'tsafe'
import * as uuid from 'uuid'
import { z } from 'zod'

import { displayCollator } from '../utils/sortUtils.ts'
import { ImageId } from './Image.ts'
import { SoundAudio, soundAudioSchema } from './SoundAudio.ts'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface Sound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: SoundAudio
  readonly image?: ImageId
}

export const soundSchema = z
  .strictObject({
    id: z.string().transform(SoundId),
    name: z.string(),
    audio: soundAudioSchema.optional(),
    image: z.string().transform(ImageId).optional(),
  })
  .readonly()

assert<Equals<Sound, z.infer<typeof soundSchema>>>()

export type SoundWithDefiniteAudio = Sound & { readonly audio: SoundAudio }

export const soundHasAudio = (sound: Sound): sound is SoundWithDefiniteAudio => sound.audio !== undefined

export const newSoundId = (): SoundId => SoundId(uuid.v4())

export const newSound = (): Sound => ({ id: newSoundId(), name: '' })

export const getSoundDisplayName = (sound: Sound): string => soundNameAsDisplayName(sound.name)
export const soundNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Sound' : name)

export const sortSoundsByDisplayName = (sounds: readonly Sound[]): Sound[] =>
  [...sounds].sort((sound1, sound2) =>
    displayCollator.compare(getSoundDisplayName(sound1), getSoundDisplayName(sound2)),
  )
