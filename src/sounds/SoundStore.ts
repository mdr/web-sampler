import { Sound, SoundId } from '../types/Sound.ts'
import { SoundState } from './SoundState.ts'

/**
 * Persistent storage for sounds in the app.
 */
export interface SoundStore {
  getSoundState: () => Promise<SoundState>
  bulkUpdate: (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]) => Promise<void>
}
