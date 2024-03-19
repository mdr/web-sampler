import { Sound, SoundId } from '../types/Sound.ts'
import { SoundState } from './SoundState.ts'

export interface BulkSoundUpdate {
  soundsToUpsert: readonly Sound[]
  soundIdsToDelete: readonly SoundId[]
}

/**
 * Persistent storage for sounds in the app.
 */
export interface SoundStore {
  getSoundState: () => Promise<SoundState>
  bulkUpdate: (update: BulkSoundUpdate) => Promise<void>
}
