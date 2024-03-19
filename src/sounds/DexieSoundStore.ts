import { AppDb } from './AppDb.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { Table } from 'dexie'
import { SoundStore } from './SoundStore.ts'
import { SoundState } from './SoundState.ts'
import { Soundboard, SoundboardId } from '../types/Soundboard.ts'

export class DexieSoundStore implements SoundStore {
  constructor(private readonly db: AppDb) {}

  getSoundState = async (): Promise<SoundState> => {
    const sounds = await this.sounds.toArray()
    const soundboards = await this.soundboards.toArray()
    return { sounds, soundboards }
  }

  bulkUpdate = (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]): Promise<void> =>
    this.db.transaction('rw', this.sounds, async () => {
      await this.sounds.bulkPut(soundsToUpsert)
      await this.sounds.bulkDelete([...soundIdsToDelete])
    })

  private get sounds(): Table<Sound, SoundId> {
    return this.db.sounds
  }

  private get soundboards(): Table<Soundboard, SoundboardId> {
    return this.db.soundboards
  }
}
