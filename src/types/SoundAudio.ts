import humanizeDuration from 'humanize-duration'
import { Equals, assert } from 'tsafe'
import { z } from 'zod'

import { pcmLength, pcmSlice } from '../utils/pcmUtils.ts'
import { Hz, MAX_VOLUME, Pcm, Samples, Seconds, Volume, secondsToMillis } from '../utils/types/brandedTypes.ts'
import { AudioData } from './AudioData.ts'
import { samplesToSeconds } from './sampleConversions.ts'

export interface SoundAudio {
  readonly pcm: Pcm
  readonly sampleRate: Hz
  readonly start: Samples // inclusive
  readonly finish: Samples // exclusive
  readonly volume: Volume
}

export const soundAudioSchema = z
  .strictObject({
    pcm: z.instanceof(Float32Array).transform(Pcm),
    sampleRate: z.number().transform(Hz),
    start: z.number().transform(Samples),
    finish: z.number().transform(Samples),
    volume: z.number().transform(Volume),
  })
  .readonly()

assert<Equals<SoundAudio, z.infer<typeof soundAudioSchema>>>()

export const newSoundAudio = ({ pcm, sampleRate }: AudioData): SoundAudio => ({
  pcm,
  sampleRate,
  start: Samples(0),
  finish: pcmLength(pcm),
  volume: MAX_VOLUME,
})

export const soundAudio: SoundAudio = soundAudioSchema.parse(
  newSoundAudio({ pcm: Pcm(new Float32Array(0)), sampleRate: Hz(0) }),
)

export const getTotalNumberOfSamples = (audio: SoundAudio): Samples => pcmLength(audio.pcm)

/**
 * Get the total duration in seconds of the underlying audio, ignoring the start and finish times.
 */
export const getTotalAudioDuration = (audio: SoundAudio): Seconds =>
  samplesToSeconds(getTotalNumberOfSamples(audio), audio.sampleRate)

/**
 * Get the duration in seconds of the play region of the audio (between the start and finish times)
 */
export const getPlayRegionDuration = (audio: SoundAudio): Seconds =>
  samplesToSeconds(Samples(audio.finish - audio.start), audio.sampleRate)

const durationHumanizer = humanizeDuration.humanizer({
  units: ['s'],
  maxDecimalPoints: 1,
})

export const getPlayRegionDurationFriendly = (audio: SoundAudio): string =>
  durationHumanizer(secondsToMillis(getPlayRegionDuration(audio)))

export const getPlayRegionPcm = (audio: SoundAudio): Pcm => pcmSlice(audio.pcm, audio.start, audio.finish)

export const getPlayRegionAudioData = (audio: SoundAudio): AudioData => ({
  pcm: getPlayRegionPcm(audio),
  sampleRate: audio.sampleRate,
})

export const getStartTime = (audio: SoundAudio): Seconds => samplesToSeconds(audio.start, audio.sampleRate)

export const getFinishTime = (audio: SoundAudio): Seconds => samplesToSeconds(audio.finish, audio.sampleRate)
