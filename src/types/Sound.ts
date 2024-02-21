import { Brand } from 'effect'
import * as uuid from 'uuid'
import { Pcm, Seconds } from '../utils/types/brandedTypes.ts'

export type SoundId = string & Brand.Brand<'SoundId'>

export const SoundId = Brand.nominal<SoundId>()

export interface SoundAudio {
  readonly pcm: Pcm
  readonly startTime: Seconds
  readonly finishTime: Seconds
}

export interface Sound {
  readonly id: SoundId
  readonly name: string
  readonly audio?: SoundAudio
}

export const newSound = (): Sound => {
  const id = SoundId(uuid.v4())
  return { id, name: '' }
}

export const getDisplayName = (sound: Sound): string => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export const sortSoundsByDisplayName = (sounds: readonly Sound[]): Sound[] =>
  [...sounds].sort((sound1, sound2) => collator.compare(getDisplayName(sound1), getDisplayName(sound2)))

export const DEFAULT_SAMPLE_RATE = 48000

export const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    const pcmDuration = audio.pcm.length / DEFAULT_SAMPLE_RATE
    if (audio.startTime < 0) {
      throw new Error(`Sound ${sound.id} start time is negative: ${audio.startTime}`)
    }
    if (audio.finishTime > pcmDuration) {
      throw new Error(`Sound ${sound.id} finish time is after sound duration: ${audio.finishTime} > ${pcmDuration}`)
    }
    if (audio.finishTime < audio.startTime) {
      throw new Error(`Sound ${sound.id} finish time is before start time: ${audio.finishTime} < ${audio.startTime}`)
    }
    for (const sample of audio.pcm) {
      if (sample < -1 || sample > 1) {
        throw new Error(`Sound ${sound.id} sample is out of range: ${sample}`)
      }
    }
  }
}
