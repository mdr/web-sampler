import { SoundState } from '../SoundState.ts'
import { SoundsDiff } from '../SoundsDiff.ts'

/**
 * Persistent storage for sounds in the app.
 */
export interface SoundStore {
  getSoundState: () => Promise<SoundState>
  bulkUpdate: (update: SoundsDiff) => Promise<void>
}
