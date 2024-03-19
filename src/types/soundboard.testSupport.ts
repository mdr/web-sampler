import { newSoundboardId, Soundboard, SoundboardId } from './Soundboard.ts'

export const SoundboardTestConstants = {
  id: SoundboardId('SoundboardTestConstants.id'),
  id2: SoundboardId('SoundboardTestConstants.id2'),
  id3: SoundboardId('SoundboardTestConstants.id3'),
  name: 'SoundboardTestConstants.name',
  oldName: 'SoundboardTestConstants.oldName',
  newName: 'SoundboardTestConstants.newName',
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
