import { Pcm, Samples, Seconds, Volume } from '../utils/types/brandedTypes.ts'
import { pcmLength, pcmSlice } from '../utils/pcmUtils.ts'
import { samplesToSeconds } from './soundConstants.ts'

export interface SoundAudio {
  readonly pcm: Pcm
  readonly startTime: Samples // inclusive
  readonly finishTime: Samples // exclusive
  readonly volume?: Volume
}

export const newSoundAudio = (pcm: Pcm): SoundAudio => ({
  pcm,
  startTime: Samples(0),
  finishTime: pcmLength(pcm),
  volume: Volume(1),
})

export const getTotalNumberOfSamples = (audio: SoundAudio): Samples => Samples(audio.pcm.length)

/**
 * Get the total duration in seconds of the underlying audio, ignoring the start and finish times.
 */
export const getTotalAudioDuration = (audio: SoundAudio): Seconds => samplesToSeconds(getTotalNumberOfSamples(audio))

/**
 * Get the duration in seconds of the play region of the audio (between the start and finish times)
 */
export const getPlayRegionDuration = (audio: SoundAudio): Seconds =>
  samplesToSeconds(Samples(audio.finishTime - audio.startTime))

export const getPlayRegionPcm = (audio: SoundAudio): Pcm => pcmSlice(audio.pcm, audio.startTime, audio.finishTime)

export const getStartTime = (audio: SoundAudio): Seconds => samplesToSeconds(audio.startTime)

export const getFinishTime = (audio: SoundAudio): Seconds => samplesToSeconds(audio.finishTime)
