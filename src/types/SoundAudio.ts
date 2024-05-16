import { Hz, MAX_VOLUME, Pcm, Samples, Seconds, secondsToMillis, Volume } from '../utils/types/brandedTypes.ts'
import { pcmLength, pcmSlice } from '../utils/pcmUtils.ts'
import { samplesToSeconds } from './sampleConversions.ts'
import { AudioData } from './AudioData.ts'
import humanizeDuration from 'humanize-duration'

export interface SoundAudio {
  readonly pcm: Pcm
  readonly sampleRate: Hz
  readonly start: Samples // inclusive
  readonly finish: Samples // exclusive
  readonly volume: Volume
}

export const newSoundAudio = ({ pcm, sampleRate }: AudioData): SoundAudio => ({
  pcm,
  sampleRate,
  start: Samples(0),
  finish: pcmLength(pcm),
  volume: MAX_VOLUME,
})

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
