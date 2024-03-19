import { newSoundboardId, Soundboard, SoundboardId } from './Soundboard.ts'

export const SoundboardTestConstants = {
  id: SoundboardId('SoundboardTestConstants.id'),
  name: 'SoundboardTestConstants.name',
}

export const makeSoundboard = ({
  id = newSoundboardId(),
  name = SoundboardTestConstants.name,
  sounds = [],
}: Partial<Soundboard> = {}): Soundboard => ({
  id,
  name,
  sounds,
})
