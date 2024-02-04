import { Sound, SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import { ISoundLibrary } from './ISoundLibrary.ts'
import * as uuid from 'uuid'
import _ from 'lodash'

export type SoundUpdateListener = (sounds: Sound[]) => void

export class SoundLibrary implements ISoundLibrary {
  private _sounds: Sound[] = []
  private readonly listeners: SoundUpdateListener[] = []

  get sounds(): Sound[] {
    return this._sounds
  }

  addListener = (listener: SoundUpdateListener): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: SoundUpdateListener): void => {
    _.remove(this.listeners, (l) => l === listener)
  }

  private notifyListeners = (): void => {
    this.listeners.forEach((listener) => listener(this._sounds))
  }

  findSound = (id: SoundId): Option<Sound> => this._sounds.find((sound) => sound.id === id)

  newSound = (): Sound => {
    const soundId = SoundId(uuid.v4())
    const sound: Sound = { id: soundId, name: '' }
    this._sounds = [...this._sounds, sound]
    this.notifyListeners()
    return sound
  }

  setName = (id: SoundId, name: string): void => this.updateSound(id, (sound) => ({ ...sound, name }))

  private updateSound = (id: SoundId, update: (sound: Sound) => Sound): void => {
    const sound = this.findSound(id)
    if (sound === undefined) {
      throw new Error(`No sound found with id ${id}`)
    }
    const newSound = update(sound)
    this._sounds = this._sounds.map((s) => (s.id === id ? newSound : s))
    this.notifyListeners()
  }
}
