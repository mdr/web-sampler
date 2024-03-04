import { newSoundId, Sound, SoundId } from './Sound.ts'

export const SoundTestConstants = {
  id: SoundId('SoundTestConstants.id'),
  id2: SoundId('SoundTestConstants.id2'),
  id3: SoundId('SoundTestConstants.id3'),
  name: 'SoundTestConstants.name',
}

export const makeSound = ({ id = newSoundId(), name = SoundTestConstants.name }: Partial<Sound> = {}): Sound => ({
  id,
  name,
})
