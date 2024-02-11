import Dexie, { Table } from 'dexie'
import { Sound } from '../types/Sound.ts'

export class AppDb extends Dexie {
  sounds!: Table<Sound>

  constructor() {
    super('web-sampler-b4cdc329-1b5e-44b9-868e-5e99e47b08e4')
    this.version(1).stores({ sounds: '++id' })
  }
}
