import Dexie, { Table } from 'dexie'
import { Sound } from '../types/Sound.ts'

export class AppDb extends Dexie {
  sounds!: Table<Sound>

  constructor() {
    super('web-sampler-78ca3c7c-70ad-42ae-81f9-bca7e9f676a7')
    this.version(1).stores({ sounds: '++id' })
  }
}
