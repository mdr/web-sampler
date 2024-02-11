import { AppDb } from './AppDb.ts'
import { Sound, SoundId } from '../types/Sound.ts'

export class SoundStore {
  constructor(private readonly db: AppDb) {}

  getAllSounds = (): Promise<Sound[]> => this.sounds.toArray()

  bulkUpdate = (soundsToPersist: Sound[], soundIdsToDelete: SoundId[]): Promise<void> =>
    this.db.transaction('rw', this.sounds, async () => {
      await this.sounds.bulkPut(soundsToPersist)
      await this.sounds.bulkDelete(soundIdsToDelete)
    })

  private get sounds() {
    return this.db.sounds
  }
}
