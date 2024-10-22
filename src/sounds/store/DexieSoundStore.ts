import { Image, ImageId, imageSchema } from '../../types/Image.ts'
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
    this.db.transaction('r', this.sounds.dexieTable, this.soundboards.dexieTable, this.images.dexieTable, async () => {
      const sounds = await this.sounds.toArray()
      const soundboards = await this.soundboards.toArray()
      const images = await this.images.toArray()
      return { sounds, soundboards, images }
    })

  bulkUpdate = ({
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
    imagesToUpsert,
    imageIdsToDelete,
  }: SoundStateDiff): Promise<void> =>
    this.db.transaction('rw', this.sounds.dexieTable, this.soundboards.dexieTable, this.images.dexieTable, async () => {
      await this.sounds.bulkPut([...soundsToUpsert])
      await this.sounds.bulkDelete([...soundIdsToDelete])
      await this.soundboards.bulkPut([...soundboardsToUpsert])
      await this.soundboards.bulkDelete([...soundboardIdsToDelete])
      await this.images.bulkPut([...imagesToUpsert])
      await this.images.bulkDelete([...imageIdsToDelete])
    })

  private get sounds(): SchemaCheckedTable<Sound, SoundId> {
    return new SchemaCheckedTable(this.db.sounds, soundSchema)
  }

  private get soundboards(): SchemaCheckedTable<Soundboard, SoundboardId> {
    return new SchemaCheckedTable(this.db.soundboards, soundboardSchema)
  }

  private get images(): SchemaCheckedTable<Image, ImageId> {
    return new SchemaCheckedTable(this.db.images, imageSchema)
  }
}
