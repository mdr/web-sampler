import Dexie, { Table } from 'dexie'

import { Image, ImageId } from '../../types/Image.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'

// Change UUID to allow backwards incompatible collection names before we stabilise the
// IndexedDB schema:
const DEV_UUID: string = '730e4dbc-82ae-447a-84bc-7e2ceda96a71'

export class AppDb extends Dexie {
  sounds!: Table<Sound, SoundId>
  soundboards!: Table<Soundboard, SoundboardId>
  images!: Table<Image, ImageId>

  constructor() {
    super(`web-sampler-${DEV_UUID}`)
    this.version(1).stores({ sounds: '++id', soundboards: '++id', images: '++id' })
  }
}
