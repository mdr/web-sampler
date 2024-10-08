import { z } from 'zod'

import { SoundId } from '../../../types/Sound.ts'
import { Hz, Samples, Volume } from '../../../utils/types/brandedTypes.ts'

export const ExportedSoundAudio = z
  .strictObject({
    sampleRate: z.number().transform(Hz),
    startTime: z.number().transform(Samples),
    finishTime: z.number().transform(Samples),
    volume: z.number().transform(Volume),
  })
  .readonly()

export type ExportedSoundAudio = z.infer<typeof ExportedSoundAudio>

export const ExportedSound = z
  .strictObject({
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
