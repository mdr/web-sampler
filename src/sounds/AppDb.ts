import Dexie, { Table } from 'dexie'
import { Sound, SoundId } from '../types/Sound.ts'
import { Soundboard, SoundboardId } from '../types/Soundboard.ts'

// Used for temporary collection names before we stabilise the IndexedDB schema
const DEV_UUID = 'ef3634c6-10e9-4714-87fd-f73ec5dfefc6'

export class AppDb extends Dexie {
  sounds!: Table<Sound, SoundId>
  soundboards!: Table<Soundboard, SoundboardId>

  constructor() {
    super(`web-sampler-${DEV_UUID}`)
    this.version(1).stores({ sounds: '++id' })
    this.version(2).stores({ sounds: '++id', soundboards: '++id' })
  }
}
