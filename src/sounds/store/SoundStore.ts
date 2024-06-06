import { SoundState } from '../SoundState.ts'
import { SoundStateDiff } from '../SoundStateDiff.ts'

/**
 * Persistent storage for sounds in the app.
 */
export interface SoundStore {
  getSoundState: () => Promise<SoundState>
  bulkUpdate: (update: SoundStateDiff) => Promise<void>
}
