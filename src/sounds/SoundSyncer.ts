import { Sound } from '../types/Sound.ts'
import { SoundStore } from './SoundStore.ts'
import { fireAndForget } from '../utils/utils.ts'
import { Option } from '../utils/types/Option.ts'
import { diffSounds } from './SoundsDiff.ts'
import { SoundState } from './SoundState.ts'

/**
 * Write-behind sync for persisting changes to in-memory sounds into a SoundStore.
 */
export class SoundSyncer {
  /**
   * The state as currently persisted in the SoundStore.
   * Or undefined if still loading.
   */
  private persistedState: Option<SoundState> = undefined

  /**
   * The latest state in memory that may potentially need to be written out to the SoundStore.
   * Or undefined if still loading.
   */
  private memoryState: Option<SoundState> = undefined

  private isDirty: boolean = false

  private isPersisting: boolean = false

  constructor(private readonly soundStore: SoundStore) {}

  soundsLoaded = (sounds: readonly Sound[]): void => {
    if (this.persistedState !== undefined || this.memoryState !== undefined) {
      throw new Error('soundsLoaded called multiple times')
    }
    this.persistedState = { sounds }
    this.memoryState = { sounds }
  }

  soundsUpdated = (state: SoundState): void => {
    if (this.persistedState === undefined || this.memoryState === undefined) {
      throw new Error('memorySoundsUpdated called before soundsLoaded')
    }
    this.memoryState = state
    this.isDirty = true
    this.tryPersistSounds()
  }

  private maybePersistSounds = async (): Promise<void> => {
    const persistedSounds = this.persistedState
    const memorySounds = this.memoryState
    if (persistedSounds === undefined || memorySounds === undefined) {
      throw new Error('attempting to persist sounds before they have been loaded')
    }
    const { soundsToUpsert, soundIdsToDelete } = diffSounds(persistedSounds, memorySounds)
    this.isDirty = false
    if (soundsToUpsert.length > 0 || soundIdsToDelete.length > 0) {
      await this.soundStore.bulkUpdate(soundsToUpsert, soundIdsToDelete)
    }
    this.persistedState = memorySounds
  }

  private tryPersistSounds = (): void =>
    fireAndForget(async (): Promise<void> => {
      if (this.isPersisting) {
        return
      }
      this.isPersisting = true
      try {
        await this.maybePersistSounds()
      } finally {
        this.isPersisting = false
      }
      if (this.isDirty) {
        this.tryPersistSounds()
      }
    })
}
