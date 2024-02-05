import Dexie, { Table } from 'dexie'
import { Sound } from '../types/Sound.ts'

export class AppDb extends Dexie {
  sounds!: Table<Sound>

  constructor() {
    super('web-sampler-a72230d5-1940-42e6-802b-7fa28ccb2d81')
    this.version(1).stores({ sounds: '++id' })
  }
}

export const db = new AppDb()
