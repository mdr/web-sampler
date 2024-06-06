import Dexie, { Table } from 'dexie'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'

// Used for temporary collection names before we stabilise the IndexedDB schema
const DEV_UUID = '8ada3f65-bd3d-4200-ac54-79b2883e294d'

export class AppDb extends Dexie {
  sounds!: Table<Sound, SoundId>
  soundboards!: Table<Soundboard, SoundboardId>

  constructor() {
    super(`web-sampler-${DEV_UUID}`)
    this.version(1).stores({ sounds: '++id', soundboards: '++id' })
  }
}
