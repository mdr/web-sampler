import { Sound, SoundId } from '../types/Sound.ts'

export interface SoundStore {
  getAllSounds: () => Promise<Sound[]>
  bulkUpdate: (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]) => Promise<void>
}
