import { Sound } from '../types/Sound.ts'
import { Soundboard } from '../types/Soundboard.ts'

export interface SoundState {
  readonly soundboards: readonly Soundboard[]
  readonly sounds: readonly Sound[]
}
