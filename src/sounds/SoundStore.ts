import { Sound, SoundId } from '../types/Sound.ts'

export interface SoundStore {
  getAllSounds: () => Promise<Sound[]>
  bulkUpdate: (soundsToPersist: Sound[], soundIdsToDelete: SoundId[]) => Promise<void>
}