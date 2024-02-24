import { z } from 'zod'
import { Seconds } from '../../../utils/types/brandedTypes.ts'
import { SoundId } from '../../../types/Sound.ts'

export const ExportedSoundAudio = z
  .object({
    startTime: z.number().transform(Seconds),
    finishTime: z.number().transform(Seconds),
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
