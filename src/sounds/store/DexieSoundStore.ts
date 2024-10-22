import { Sound, SoundId, soundSchema } from '../../types/Sound.ts'
import { Soundboard, SoundboardId, soundboardSchema } from '../../types/Soundboard.ts'
import { SoundState } from '../SoundState.ts'
import { SoundStateDiff } from '../SoundStateDiff.ts'
import { AppDb } from './AppDb.ts'
import { SchemaCheckedTable } from './SchemaCheckedTable.ts'
import { SoundStore } from './SoundStore.ts'

export class DexieSoundStore implements SoundStore {
  constructor(private readonly db: AppDb) {}

  getSoundState = async (): Promise<SoundState> =>
    this.db.transaction('r', this.sounds.dexieTable, this.soundboards.dexieTable, async () => {
      const sounds = await this.sounds.toArray()
      const soundboards = await this.soundboards.toArray()
      return { sounds, soundboards, images: [] }
    })

  bulkUpdate = ({
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
  }: SoundStateDiff): Promise<void> =>
    this.db.transaction('rw', this.sounds.dexieTable, this.soundboards.dexieTable, async () => {
      await this.sounds.bulkPut([...soundsToUpsert])
      await this.sounds.bulkDelete([...soundIdsToDelete])
      await this.soundboards.bulkPut([...soundboardsToUpsert])
      await this.soundboards.bulkDelete([...soundboardIdsToDelete])
    })

  private get sounds(): SchemaCheckedTable<Sound, SoundId> {
    return new SchemaCheckedTable(this.db.sounds, soundSchema)
  }

  private get soundboards(): SchemaCheckedTable<Soundboard, SoundboardId> {
    return new SchemaCheckedTable(this.db.soundboards, soundboardSchema)
  }
}
