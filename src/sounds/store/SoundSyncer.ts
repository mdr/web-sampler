import { Option } from '../../utils/types/Option.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { SoundState } from '../SoundState.ts'
import { compareSoundStates, isDiffEmpty } from '../SoundStateDiff.ts'
import { SoundStore } from './SoundStore.ts'

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

  soundsLoaded = (soundState: SoundState): void => {
    if (this.persistedState !== undefined || this.memoryState !== undefined) {
      throw new Error('soundsLoaded called multiple times')
    }
    this.persistedState = soundState
    this.memoryState = soundState
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
    const persistedState = this.persistedState
    const memoryState = this.memoryState
    if (persistedState === undefined || memoryState === undefined) {
      throw new Error('attempting to persist sounds before they have been loaded')
    }
    const diff = compareSoundStates(persistedState, memoryState)
    this.isDirty = false
    if (!isDiffEmpty(diff)) {
      await this.soundStore.bulkUpdate(diff)
    }
    this.persistedState = memoryState
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
