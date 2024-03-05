import { newSound, newSoundId, Sound, SoundId, validateSound } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import _ from 'lodash'
import { SoundActions } from './soundHooks.ts'
import { unawaited } from '../utils/utils.ts'
import { Pcm, Seconds, Volume } from '../utils/types/brandedTypes.ts'
import { Draft, produce } from 'immer'
import { pcmDurationInSeconds } from '../utils/pcmUtils.ts'
import { newSoundAudio } from '../types/SoundAudio.ts'
import { DEFAULT_SAMPLE_RATE } from '../types/soundConstants.ts'
import { SoundStore } from './SoundStore.ts'
import { SoundSyncer } from './SoundSyncer.ts'

export type SoundLibraryUpdatedListener = () => void

interface UndoRedoRecord {
  sounds: readonly Sound[]
}

export class SoundLibrary implements SoundActions {
  private _sounds: readonly Sound[] = []
  private readonly undoStack: UndoRedoRecord[] = []
  private readonly redoStack: UndoRedoRecord[] = []
  private _isLoading = true
  private readonly listeners: SoundLibraryUpdatedListener[] = []
  private readonly soundSyncer: SoundSyncer

  constructor(private readonly soundStore: SoundStore) {
    this.soundSyncer = new SoundSyncer(soundStore)
    unawaited(this.loadSounds())
  }

  private loadSounds = async (): Promise<void> => {
    const sounds = await this.soundStore.getAllSounds()
    sounds.forEach(validateSound)
    this._sounds = sounds
    this._isLoading = false
    this.notifyListeners()
    this.soundSyncer.soundsLoaded(sounds)
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

  getSound = (id: SoundId): Sound => {
    const sound = this.findSound(id)
    if (sound === undefined) {
      throw new Error(`Sound with id ${id} does not exist`)
    }
    return sound
  }

  newSound = (): Sound => {
    this.checkNotLoading()
    const sound: Sound = newSound()
    validateSound(sound)
    const updatedSounds = [...this._sounds, sound]
    this.setSounds(updatedSounds)
    return sound
  }

  setName = (id: SoundId, name: string): void =>
    this.updateSound(id, (sound) => {
      sound.name = name
    })

  setAudioPcm = (id: SoundId, pcm: Pcm) =>
    this.updateSound(id, (sound) => {
      sound.audio = newSoundAudio(pcm)
    })

  setStartTime = (id: SoundId, startTime: Seconds) =>
    this.updateSound(id, (sound) => {
      if (sound.audio === undefined) {
        throw Error(`No audio defined for sound ${sound.id}`)
      }
      sound.audio.startTime = startTime
    })

  setFinishTime = (id: SoundId, finishTime: Seconds) =>
    this.updateSound(id, (sound) => {
      if (sound.audio === undefined) {
        throw Error(`No audio defined for sound ${sound.id}`)
      }
      sound.audio.finishTime = finishTime
    })

  setVolume = (id: SoundId, volume: Option<Volume>) =>
    this.updateSound(id, (sound) => {
      if (sound.audio === undefined) {
        throw Error(`No audio defined for sound ${sound.id}`)
      }
      sound.audio.volume = volume
    })

  cropAudio = (id: SoundId) =>
    this.updateSound(id, (sound) => {
      const audio = sound.audio
      if (audio === undefined) {
        throw Error(`No audio defined for sound ${sound.id}`)
      }

      audio.pcm = Pcm(audio.pcm.slice(audio.startTime * DEFAULT_SAMPLE_RATE, audio.finishTime * DEFAULT_SAMPLE_RATE))
      audio.startTime = Seconds(0)
      audio.finishTime = pcmDurationInSeconds(audio.pcm)
    })

  deleteSound = (id: SoundId): void => {
    this.checkNotLoading()
    const updatedSounds = this._sounds.filter((sound) => sound.id !== id)
    this.setSounds(updatedSounds)
  }

  duplicateSound = (id: SoundId): void => {
    this.checkNotLoading()
    const sound = this.getSound(id)
    const newSound = { ...sound, id: newSoundId() }
    validateSound(newSound)
    const updatedSounds = [...this._sounds, newSound]
    this.setSounds(updatedSounds)
  }

  importSounds = (sounds: readonly Sound[]) => {
    this.checkNotLoading()
    sounds.forEach(validateSound)
    this.setSounds(sounds)
  }

  undo = (): void => {
    this.checkNotLoading()
    const record = this.undoStack.pop()
    if (record === undefined) {
      return
    }
    this.redoStack.push({ sounds: this._sounds })
    this.setSoundsCore(record.sounds)
  }

  redo = (): void => {
    this.checkNotLoading()
    const record = this.redoStack.pop()
    if (record === undefined) {
      return
    }
    this.undoStack.push({ sounds: this._sounds })
    this.setSoundsCore(record.sounds)
  }

  private updateSound = (id: SoundId, update: (sound: Draft<Sound>) => void): void =>
    this.updateSoundPure(id, (sound) => produce(sound, update))

  private updateSoundPure = (id: SoundId, update: (sound: Sound) => Sound): void => {
    this.checkNotLoading()
    const currentSound = this.getSound(id)
    const updatedSound = update(currentSound)
    if (!_.isEqual(currentSound, updatedSound)) {
      validateSound(updatedSound)
      const updatedSounds = this._sounds.map((sound) => (sound.id === id ? updatedSound : sound))
      this.setSounds(updatedSounds)
    }
  }

  private setSounds = (sounds: readonly Sound[]): void => {
    this.undoStack.push({ sounds: this._sounds })
    this.redoStack.length = 0
    this.setSoundsCore(sounds)
  }

  private setSoundsCore = (sounds: readonly Sound[]): void => {
    this._sounds = sounds
    this.soundSyncer.soundsUpdated(sounds)
    this.notifyListeners()
  }

  private checkNotLoading = (): void => {
    if (this._isLoading) {
      throw new Error('Sounds are still loading')
    }
  }
}
