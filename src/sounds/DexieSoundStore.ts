import { AppDb } from './AppDb.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { Table } from 'dexie'
import { SoundStore } from './SoundStore.ts'

export class DexieSoundStore implements SoundStore {
  constructor(private readonly db: AppDb) {}

  getAllSounds = (): Promise<Sound[]> => this.sounds.toArray()

  bulkUpdate = (soundsToPersist: Sound[], soundIdsToDelete: SoundId[]): Promise<void> =>
    this.db.transaction('rw', this.sounds, async () => {
      await this.sounds.bulkPut(soundsToPersist)
      await this.sounds.bulkDelete(soundIdsToDelete)
    })

  private get sounds(): Table<Sound, SoundId> {
    return this.db.sounds
  }
}
