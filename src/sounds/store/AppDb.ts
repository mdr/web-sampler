import Dexie, { Table } from 'dexie'

import { Image, ImageId } from '../../types/Image.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'

// Change UUID to allow backwards incompatible collection names before we stabilise the
// IndexedDB schema.
// https://www.uuidgenerator.net/#google_vignette
const DEV_UUID: string = '456e3eb5-b54a-48b5-81c4-e426e5fed4db'

export class AppDb extends Dexie {
  sounds!: Table<Sound, SoundId>
  soundboards!: Table<Soundboard, SoundboardId>
  images!: Table<Image, ImageId>

  constructor() {
    super(`web-sampler-${DEV_UUID}`)
    this.version(1).stores({ sounds: '++id', soundboards: '++id', images: '++id' })
  }
}
