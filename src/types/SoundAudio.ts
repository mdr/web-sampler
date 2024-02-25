import { Pcm, Seconds } from '../utils/types/brandedTypes.ts'
import { DEFAULT_SAMPLE_RATE, SoundId } from './Sound.ts'

export interface SoundAudio {
  readonly pcm: Pcm
  readonly startTime: Seconds
  readonly finishTime: Seconds
}

/**
 * Get the total duration in seconds of the underlying audio, ignoring the start and finish times.
 */
export const getTotalAudioDuration = (audio: SoundAudio): Seconds => Seconds(audio.pcm.length / DEFAULT_SAMPLE_RATE)

/**
 * Get the duration in seconds of the play region of the audio (between the start and finish times)
 */
export const getPlayRegionDuration = (audio: SoundAudio): Seconds => Seconds(audio.finishTime - audio.startTime)

const cropPcm = (pcm: Pcm, start: Seconds, finish: Seconds): Pcm => {
  const startSample = Math.floor(start * DEFAULT_SAMPLE_RATE)
  const finishSample = Math.floor(finish * DEFAULT_SAMPLE_RATE)
  return Pcm(pcm.slice(startSample, finishSample))
}

export const getPlayRegionPcm = (audio: SoundAudio): Pcm => cropPcm(audio.pcm, audio.startTime, audio.finishTime)

export const validateSoundAudio = (soundId: SoundId, audio: SoundAudio): void => {
  const pcmDuration = getTotalAudioDuration(audio)
  if (audio.startTime < 0) {
    throw new Error(`Sound ${soundId} start time is negative: ${audio.startTime}`)
  }
  if (audio.finishTime > pcmDuration) {
    throw new Error(`Sound ${soundId} finish time is after sound duration: ${audio.finishTime} > ${pcmDuration}`)
  }
  if (audio.finishTime < audio.startTime) {
    throw new Error(`Sound ${soundId} finish time is before start time: ${audio.finishTime} < ${audio.startTime}`)
  }
  for (const sample of audio.pcm) {
    if (sample < -1 || sample > 1) {
      throw new Error(`Sound ${soundId} sample is out of range: ${sample}`)
    }
  }
}
