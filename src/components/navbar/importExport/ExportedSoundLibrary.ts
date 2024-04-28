import { z } from 'zod'
import { Samples, Volume } from '../../../utils/types/brandedTypes.ts'
import { SoundId } from '../../../types/Sound.ts'

export const ExportedSoundAudio = z
  .object({
    startTime: z.number().transform(Samples),
    finishTime: z.number().transform(Samples),
    volume: z
      .number()
      .optional()
      .transform((volume) => (volume === undefined ? undefined : Volume(volume))),
  })
  .readonly()

export type ExportedSoundAudio = z.infer<typeof ExportedSoundAudio>

export const ExportedSound = z
  .object({
    id: z.string().transform(SoundId),
    name: z.string(),
    audio: ExportedSoundAudio.optional(),
  })
  .readonly()

export type ExportedSound = z.infer<typeof ExportedSound>

export const ExportedSoundLibrary = z
  .object({
    version: z.number(),
    sounds: z.array(ExportedSound),
  })
  .readonly()

export type ExportedSoundLibrary = z.infer<typeof ExportedSoundLibrary>
