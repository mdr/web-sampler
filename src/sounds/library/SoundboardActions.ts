import { KeyboardShortcut } from '../../types/KeyboardShortcut.ts'
import { SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'
import { Option } from '../../utils/types/Option.ts'

export interface SoundboardActions {
  newSoundboard(): Soundboard

  deleteSoundboard(id: SoundboardId): void

  setSoundboardName(id: SoundboardId, name: string): void

  addSoundToSoundboard(soundboardId: SoundboardId, soundId: SoundId): void

  removeSoundFromSoundboard(soundboardId: SoundboardId, soundId: SoundId): void

  /**
   * Move a sound in a soundboard to a new position.
   * The source sound is moved to before the target sound, or to the end of the soundboard if targetSoundId is undefined.
   */
  moveSoundInSoundboard(soundboardId: SoundboardId, sourceSoundId: SoundId, targetSoundId: Option<SoundId>): void

  setSoundboardTileShortcut(soundboardId: SoundboardId, soundId: SoundId, shortcut: KeyboardShortcut): void

  clearSoundboardTileShortcut(soundboardId: SoundboardId, soundId: SoundId): void
}
