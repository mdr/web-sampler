import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import { SoundUpdateListener } from './SoundLibrary.ts'

export interface ISoundLibrary {
  readonly sounds: Sound[]

  addListener(listener: SoundUpdateListener): void

  removeListener(listener: SoundUpdateListener): void

  newSound(): Sound

  findSound(id: SoundId): Option<Sound>
}
