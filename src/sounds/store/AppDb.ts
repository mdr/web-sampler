import Dexie, { Table } from 'dexie'

import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'

// Change UUID to allow backwards incompatible collection names before we stabilise the
// IndexedDB schema:
const DEV_UUID: string = '0030263b-d852-4ddd-951b-07aa9e5fc5d4'

export class AppDb extends Dexie {
  sounds!: Table<Sound, SoundId>
  soundboards!: Table<Soundboard, SoundboardId>

  constructor() {
    super(`web-sampler-${DEV_UUID}`)
    this.version(1).stores({ sounds: '++id', soundboards: '++id' })
  }
}
