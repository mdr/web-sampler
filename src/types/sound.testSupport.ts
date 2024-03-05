import { newSoundId, Sound, SoundId } from './Sound.ts'
import { Pcm, Seconds, Volume } from '../utils/types/brandedTypes.ts'
import { SoundAudio } from './SoundAudio.ts'
import { DEFAULT_SAMPLE_RATE } from './soundConstants.ts'

export const SoundTestConstants = {
  id: SoundId('SoundTestConstants.id'),
  id2: SoundId('SoundTestConstants.id2'),
  id3: SoundId('SoundTestConstants.id3'),
  name: 'SoundTestConstants.name',
  oldName: 'SoundTestConstants.oldName',
  newName: 'SoundTestConstants.newName',
  startTime: Seconds(5),
  finishTime: Seconds(10),
  volume: Volume(0.5),
  pcm: Pcm(new Float32Array(20 * DEFAULT_SAMPLE_RATE)),
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
  startTime = SoundTestConstants.startTime,
  finishTime = SoundTestConstants.finishTime,
  volume = SoundTestConstants.volume,
} = {}): SoundAudio => ({
  pcm,
  startTime,
  finishTime,
  volume,
})
