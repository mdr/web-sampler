import { newSoundboardId, Soundboard, SoundboardId, SoundboardTile } from './Soundboard.ts'
import { SoundTestConstants } from './sound.testSupport.ts'
import { KeyboardShortcut } from './KeyboardShortcut.ts'

export const SoundboardTestConstants = {
  id: SoundboardId('SoundboardTestConstants.id'),
  id2: SoundboardId('SoundboardTestConstants.id2'),
  id3: SoundboardId('SoundboardTestConstants.id3'),
  name: 'SoundboardTestConstants.name',
  oldName: 'SoundboardTestConstants.oldName',
  newName: 'SoundboardTestConstants.newName',
  shortcut: KeyboardShortcut('k'),
}

export const makeSoundboardTile = ({
  soundId = SoundTestConstants.id,
}: Partial<SoundboardTile> = {}): SoundboardTile => ({ soundId })

export const makeSoundboard = ({
  id = newSoundboardId(),
  name = SoundboardTestConstants.name,
  tiles = [],
}: Partial<Soundboard> = {}): Soundboard => ({
  id,
  name,
  tiles,
})
