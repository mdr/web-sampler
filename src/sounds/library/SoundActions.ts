import { AudioData } from '../../types/AudioData.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Samples, Volume } from '../../utils/types/brandedTypes.ts'

export interface SoundActions {
  newSound(): Sound

  setSoundName(id: SoundId, name: string): void

  setAudioData(id: SoundId, audioData: AudioData): void

  deleteSound(id: SoundId): void

  duplicateSound(id: SoundId): void

  setAudioStart(id: SoundId, startTime: Samples): void

  setAudioFinish(id: SoundId, finishTime: Samples): void

  setVolume(id: SoundId, volume: Volume): void

  cropAudio(id: SoundId): void

  importSounds(sounds: readonly Sound[]): void
}
