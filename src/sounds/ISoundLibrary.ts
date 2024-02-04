import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'

export interface ISoundLibrary {
  findSound(id: SoundId): Option<Sound>
}
