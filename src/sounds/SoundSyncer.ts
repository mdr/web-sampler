import { Sound } from '../types/Sound.ts'
import { SoundStore } from './SoundStore.ts'
import { fireAndForget } from '../utils/utils.ts'
import { Option } from '../utils/types/Option.ts'
import { diffSounds } from './SoundsDiff.ts'

export class SoundSyncer {
  /**
   * The exact set of Sounds that are known to be persisted in the SoundStore.
   * Or undefined if still loading.
   */
  private persistedSounds: Option<readonly Sound[]> = undefined
  /**
   * The latest set of Sounds in memory that may need to be synced with the SoundStore.
   */
  private memorySounds: Option<readonly Sound[]> = undefined

  private isDirty: boolean = false

  private isPersisting: boolean = false

  constructor(private readonly soundStore: SoundStore) {}

  soundsLoaded = (sounds: readonly Sound[]): void => {
    if (this.persistedSounds !== undefined || this.memorySounds !== undefined) {
      throw new Error('soundsLoaded called multiple times')
    }
    this.persistedSounds = sounds
    this.memorySounds = sounds
  }

  memorySoundsUpdated = (sounds: readonly Sound[]): void => {
    if (this.persistedSounds === undefined || this.memorySounds === undefined) {
      throw new Error('memorySoundsUpdated called before soundsLoaded')
    }
    this.memorySounds = sounds
    this.isDirty = true
    this.tryPersistSounds()
  }

  private maybePersistSounds = async (): Promise<void> => {
    const persistedSounds = this.persistedSounds
    const memorySounds = this.memorySounds
    if (persistedSounds === undefined || memorySounds === undefined) {
      throw new Error('attempting to persist sounds before they have been loaded')
    }
    const { soundsToUpsert, soundIdsToDelete } = diffSounds(persistedSounds, memorySounds)
    this.isDirty = false
    if (soundsToUpsert.length > 0 || soundIdsToDelete.length > 0) {
      await this.soundStore.bulkUpdate(soundsToUpsert, soundIdsToDelete)
    }
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
