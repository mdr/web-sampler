import { Hz, Pcm, Samples, Volume } from '../utils/types/brandedTypes.ts'
import { Sound, SoundId, newSoundId } from './Sound.ts'
import { SoundAudio } from './SoundAudio.ts'

export const makePcm = (samples: Samples): Pcm => Pcm(new Float32Array(samples))

export const SoundTestConstants = {
  id: SoundId('SoundTestConstants.id'),
  id2: SoundId('SoundTestConstants.id2'),
  id3: SoundId('SoundTestConstants.id3'),
  name: 'SoundTestConstants.name',
  oldName: 'SoundTestConstants.oldName',
  newName: 'SoundTestConstants.newName',
  start: Samples(5),
  finish: Samples(10),
  volume: Volume(0.5),
  pcm: makePcm(Samples(100)),
  sampleRate: Hz(48000),
  emptyPcm: makePcm(Samples(0)),
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
  sampleRate = SoundTestConstants.sampleRate,
  start = SoundTestConstants.start,
  finish = SoundTestConstants.finish,
  volume = SoundTestConstants.volume,
}: Partial<SoundAudio> = {}): SoundAudio => ({
  pcm,
  sampleRate,
  start,
  finish,
  volume,
})

export const makeSoundWithAudio = ({
  id = newSoundId(),
  name = SoundTestConstants.name,
  pcm = SoundTestConstants.pcm,
  sampleRate = SoundTestConstants.sampleRate,
  start = SoundTestConstants.start,
  finish = SoundTestConstants.finish,
  volume = SoundTestConstants.volume,
}: Partial<Sound & SoundAudio> = {}): Sound =>
  makeSound({
    id,
    name,
    audio: makeSoundAudio({ pcm, sampleRate, start, finish, volume }),
  })
