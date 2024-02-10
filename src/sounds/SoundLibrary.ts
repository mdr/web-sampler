import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import * as uuid from 'uuid'
import _ from 'lodash'
import { SoundActions } from './soundHooks.ts'
import { db } from './soundDb.ts'
import { fireAndForget } from '../utils/utils.ts'
import { Duration } from 'luxon'

export type SoundsUpdatedListener = (sounds: readonly Sound[]) => void

const PERSIST_DIRTY_INTERVAL = Duration.fromObject({ seconds: 1 })

export class SoundLibrary implements SoundActions {
  private _sounds: readonly Sound[] = []
  private readonly dirtySoundIds: SoundId[] = []
  private isLoading = true
  private isPersisting = false
  private readonly listeners: SoundsUpdatedListener[] = []

  constructor() {
    setInterval(this.tryPersistDirtySounds, PERSIST_DIRTY_INTERVAL.toMillis())
    fireAndForget(() => this.loadSounds())
  }

  private loadSounds = async (): Promise<void> => {
    this._sounds = await db.sounds.toArray()
    this.isLoading = false
    this.notifyListeners()
  }

  get sounds(): readonly Sound[] {
    return this._sounds
  }

  addListener = (listener: SoundsUpdatedListener): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: SoundsUpdatedListener): void => {
    _.remove(this.listeners, (l) => l === listener)
  }

  private notifyListeners = (): void => {
    this.listeners.forEach((listener) => listener(this._sounds))
  }

  findSound = (id: SoundId): Option<Sound> => this._sounds.find((sound) => sound.id === id)

  private checkNotLoading = (): void => {
    if (this.isLoading) {
      throw new Error('Sounds are still loading')
    }
  }

  newSound = (): Sound => {
    this.checkNotLoading()
    const id = SoundId(uuid.v4())
    const sound: Sound = { id, name: '' }
    this._sounds = [...this._sounds, sound]
    this.markAsDirty(id)
    this.notifyListeners()
    return sound
  }

  private markAsDirty = (id: SoundId): void => {
    if (!this.dirtySoundIds.includes(id)) {
      this.dirtySoundIds.push(id)
      // Try an immediate persist to save as soon as possible
      this.tryPersistDirtySounds()
    }
  }

  setName = (id: SoundId, name: string): void => this.updateSound(id, (sound) => ({ ...sound, name }))

  setAudio = (id: SoundId, audio: Float32Array) => this.updateSound(id, (sound) => ({ ...sound, audio }))

  private updateSound = (id: SoundId, update: (sound: Sound) => Sound): void => {
    this.checkNotLoading()
    const sound = this.findSound(id)
    if (sound === undefined) {
      throw new Error(`No sound found with id ${id}`)
    }
    const newSound = update(sound)
    if (!_.isEqual(sound, newSound)) {
      this._sounds = this._sounds.map((s) => (s.id === id ? newSound : s))
      this.markAsDirty(id)
      this.notifyListeners()
    }
  }
  deleteSound = (id: SoundId): void => {
    this.checkNotLoading()
    this._sounds = this._sounds.filter((sound) => sound.id !== id)
    this.dirtySoundIds.push(id)
    this.notifyListeners()
  }

  private tryPersistDirtySounds = () =>
    fireAndForget(async (): Promise<void> => {
      if (this.isPersisting) {
        return
      }
      this.isPersisting = true
      try {
        await this.persistDirtySounds()
      } finally {
        this.isPersisting = false
      }
    })

  private persistDirtySounds = async (): Promise<void> => {
    if (this.dirtySoundIds.length === 0) {
      return
    }
    const soundsToPersist = this.dirtySoundIds
      .map((id) => this.findSound(id))
      .filter((sound): sound is Sound => sound !== undefined)
    const soundIdsToDelete = this.dirtySoundIds.filter((id) => this.findSound(id) === undefined)
    await db.transaction('rw', db.sounds, async () => {
      await db.sounds.bulkPut(soundsToPersist)
      await db.sounds.bulkDelete(soundIdsToDelete)
    })
    this.dirtySoundIds.length = 0
  }
}
