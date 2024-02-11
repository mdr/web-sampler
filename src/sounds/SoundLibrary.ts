import { newSound, Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import _ from 'lodash'
import { SoundActions } from './soundHooks.ts'
import { fireAndForget } from '../utils/utils.ts'
import { Duration } from 'luxon'
import { SoundStore } from './SoundStore.ts'
import { Pcm } from '../utils/types/brandedTypes.ts'

export type SoundLibraryUpdatedListener = () => void

const PERSIST_DIRTY_INTERVAL = Duration.fromObject({ seconds: 1 })

interface UndoRedoRecord {
  sounds: readonly Sound[]
  affectedSoundIds: readonly SoundId[]
}

export class SoundLibrary implements SoundActions {
  private _sounds: readonly Sound[] = []
  private readonly dirtySoundIds: SoundId[] = []
  private readonly undoStack: UndoRedoRecord[] = []
  private readonly redoStack: UndoRedoRecord[] = []
  private _isLoading = true
  private isPersisting = false
  private readonly listeners: SoundLibraryUpdatedListener[] = []

  constructor(private readonly soundStore: SoundStore) {
    setInterval(this.tryPersistDirtySounds, PERSIST_DIRTY_INTERVAL.toMillis())
    fireAndForget(() => this.loadSounds())
  }

  private loadSounds = async (): Promise<void> => {
    this._sounds = await this.soundStore.getAllSounds()
    this._isLoading = false
    this.notifyListeners()
  }

  get sounds(): readonly Sound[] {
    return this._sounds
  }

  get isLoading(): boolean {
    return this._isLoading
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0
  }

  addListener = (listener: SoundLibraryUpdatedListener): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: SoundLibraryUpdatedListener): void => {
    _.remove(this.listeners, (l) => l === listener)
  }

  private notifyListeners = (): void => {
    this.listeners.forEach((listener) => listener())
  }

  findSound = (id: SoundId): Option<Sound> => this._sounds.find((sound) => sound.id === id)

  private checkNotLoading = (): void => {
    if (this._isLoading) {
      throw new Error('Sounds are still loading')
    }
  }

  newSound = (): Sound => {
    this.checkNotLoading()
    const sound: Sound = newSound()
    const updatedSounds = [...this._sounds, sound]
    this.setSounds(updatedSounds, [sound.id])
    return sound
  }

  private setSounds = (sounds: readonly Sound[], affectedSoundIds: readonly SoundId[]): void => {
    this.undoStack.push({ sounds: this._sounds, affectedSoundIds })
    this.redoStack.length = 0
    this._sounds = sounds
    this.dirtySoundIds.push(...affectedSoundIds)
    this.notifyListeners()
    this.tryPersistDirtySounds()
  }

  setName = (id: SoundId, name: string): void => this.updateSound(id, (sound) => ({ ...sound, name }))

  setAudioPcm = (id: SoundId, pcm: Pcm) => this.updateSound(id, (sound) => ({ ...sound, audio: { pcm } }))

  private updateSound = (id: SoundId, update: (sound: Sound) => Sound): void => {
    this.checkNotLoading()
    const sound = this.findSound(id)
    if (sound === undefined) {
      throw new Error(`No sound found with id ${id}`)
    }
    const updatedSound = update(sound)
    if (!_.isEqual(sound, updatedSound)) {
      const updatedSounds = this._sounds.map((s) => (s.id === id ? updatedSound : s))
      this.setSounds(updatedSounds, [id])
    }
  }

  deleteSound = (id: SoundId): void => {
    this.checkNotLoading()
    const updatedSounds = this._sounds.filter((sound) => sound.id !== id)
    this.setSounds(updatedSounds, [id])
  }

  undo = (): void => {
    const record = this.undoStack.pop()
    if (record === undefined) {
      return
    }
    this.redoStack.push({ sounds: this._sounds, affectedSoundIds: record.affectedSoundIds })
    this._sounds = record.sounds
    this.dirtySoundIds.push(...record.affectedSoundIds)
    this.notifyListeners()
    this.tryPersistDirtySounds()
  }

  redo = (): void => {
    const record = this.redoStack.pop()
    if (record === undefined) {
      return
    }
    this.undoStack.push({ sounds: this._sounds, affectedSoundIds: record.affectedSoundIds })
    this._sounds = record.sounds
    this.dirtySoundIds.push(...record.affectedSoundIds)
    this.notifyListeners()
    this.tryPersistDirtySounds()
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
    this.dirtySoundIds.length = 0

    await this.soundStore.bulkUpdate(soundsToPersist, soundIdsToDelete)
  }
}
