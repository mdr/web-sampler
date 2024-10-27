import { AudioData } from '../../types/AudioData.ts'
import { Image, ImageId } from '../../types/Image.ts'
import { KeyboardShortcut } from '../../types/KeyboardShortcut.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'
import { Option } from '../../utils/types/Option.ts'
import { ImageData, Samples, Volume } from '../../utils/types/brandedTypes.ts'

export interface SoundActions {
  newSound(): Sound

  setName(id: SoundId, name: string): void

  setAudioData(id: SoundId, audioData: AudioData): void

  deleteSound(id: SoundId): void

  duplicateSound(id: SoundId): void

  setAudioStart(id: SoundId, startTime: Samples): void

  setAudioFinish(id: SoundId, finishTime: Samples): void

  setVolume(id: SoundId, volume: Volume): void

  cropAudio(id: SoundId): void

  importSounds(sounds: readonly Sound[]): void

  newSoundboard(): Soundboard

  setSoundboardName(id: SoundboardId, name: string): void

  addSoundToSoundboard(soundboardId: SoundboardId, soundId: SoundId): void

  removeSoundFromSoundboard(soundboardId: SoundboardId, soundId: SoundId): void

  /**
   * Move a sound in a soundboard to a new position.
   * The source sound is moved to before the target sound, or to the end of the soundboard if targetSoundId is undefined.
   */
  moveSoundInSoundboard(soundboardId: SoundboardId, sourceSoundId: SoundId, targetSoundId: Option<SoundId>): void

  setSoundboardTileShortcut(soundboardId: SoundboardId, soundId: SoundId, shortcut: Option<KeyboardShortcut>): void

  newImage(): Image

  setImageName(id: ImageId, name: string): void

  setImageData(id: ImageId, imageData: ImageData): void

  undo(): void

  redo(): void
}
