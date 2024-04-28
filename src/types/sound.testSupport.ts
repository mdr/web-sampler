import { newSoundId, Sound, SoundId } from './Sound.ts'
import { Pcm, Samples, Seconds, Volume } from '../utils/types/brandedTypes.ts'
import { SoundAudio } from './SoundAudio.ts'
import { DEFAULT_SAMPLE_RATE, secondsToSamples } from './soundConstants.ts'

export const makePcm = (samples: Samples): Pcm => Pcm(new Float32Array(samples))
export const makePcmOfDuration = (seconds: Seconds): Pcm => makePcm(secondsToSamples(seconds))

export const SoundTestConstants = {
  id: SoundId('SoundTestConstants.id'),
  id2: SoundId('SoundTestConstants.id2'),
  id3: SoundId('SoundTestConstants.id3'),
  name: 'SoundTestConstants.name',
  oldName: 'SoundTestConstants.oldName',
  newName: 'SoundTestConstants.newName',
  startTime: Samples(5),
  finishTime: Samples(10),
  volume: Volume(0.5),
  pcm: makePcmOfDuration(Seconds(20)),
  emptyPcm: makePcmOfDuration(Seconds(0)),
}

export const makeSound = ({
  id = newSoundId(),
  name = SoundTestConstants.name,
  audio = undefined,
}: Partial<Sound> = {}): Sound => ({
  id,
  name,
  audio,
})

export const makeSoundAudio = ({
  pcm = SoundTestConstants.pcm,
  sampleRate = DEFAULT_SAMPLE_RATE,
  start = SoundTestConstants.startTime,
  finish = SoundTestConstants.finishTime,
  volume = SoundTestConstants.volume,
}: Partial<SoundAudio> = {}): SoundAudio => ({
  pcm,
  sampleRate,
  start,
  finish,
  volume,
})
