import { AppDb } from './AppDb.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Table } from 'dexie'
import { SoundStore } from './SoundStore.ts'
import { SoundState } from '../SoundState.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'
import { SoundStateDiff } from '../SoundStateDiff.ts'

export class DexieSoundStore implements SoundStore {
  constructor(private readonly db: AppDb) {}

  getSoundState = async (): Promise<SoundState> => {
    const sounds = await this.sounds.toArray()
    const soundboards = await this.soundboards.toArray()
    return { sounds, soundboards }
  }

  bulkUpdate = ({
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
  }: SoundStateDiff): Promise<void> =>
    this.db.transaction('rw', this.sounds, this.soundboards, async () => {
      await this.sounds.bulkPut(soundsToUpsert)
      await this.sounds.bulkDelete([...soundIdsToDelete])
      await this.soundboards.bulkPut(soundboardsToUpsert)
      await this.soundboards.bulkDelete([...soundboardIdsToDelete])
    })

  private get sounds(): Table<Sound, SoundId> {
    return this.db.sounds
  }

  private get soundboards(): Table<Soundboard, SoundboardId> {
    return this.db.soundboards
  }
}
