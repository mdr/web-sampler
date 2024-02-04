import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import { ISoundLibrary } from './ISoundLibrary.ts'

export class SoundLibrary implements ISoundLibrary {
  private readonly sounds: Sound[] = []
  findSound = (id: SoundId): Option<Sound> => this.sounds.find((sound) => sound.id === id)
}
