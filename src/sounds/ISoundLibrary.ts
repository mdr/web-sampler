import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import { SoundUpdateListener } from './SoundLibrary.ts'

export interface SoundActions {
  newSound(): Sound

  setName(id: SoundId, name: string): void
}

export interface ISoundLibrary extends SoundActions {
  readonly sounds: Sound[]

  addListener(listener: SoundUpdateListener): void

  removeListener(listener: SoundUpdateListener): void

  findSound(id: SoundId): Option<Sound>
}
