import { Seconds } from '../../../utils/types/brandedTypes.ts'
import { SoundId } from '../../../types/Sound.ts'

export interface ExportedSound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: ExportedSoundAudio
}

export interface ExportedSoundAudio {
  readonly startTime: Seconds
  readonly finishTime: Seconds
}

export interface ExportedSoundLibrary {
  readonly version: number
  readonly sounds: ExportedSound[]
}