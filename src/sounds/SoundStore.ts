import { Sound, SoundId } from '../types/Sound.ts'

/**
 * Persistent storage for sounds in the app.
 */
export interface SoundStore {
  getAllSounds: () => Promise<Sound[]>
  bulkUpdate: (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]) => Promise<void>
}
