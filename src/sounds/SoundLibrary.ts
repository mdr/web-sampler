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
import { UndoRedoManager } from './UndoRedoManager.ts'

export type SoundLibraryUpdatedListener = () => void

/**
 * In-memory storage and manipulation of sounds in the app.
 */
export class SoundLibrary implements SoundActions {
  private _isLoading = true
  private _sounds: readonly Sound[] = []
  private readonly undoRedoManager = new UndoRedoManager()
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
    this.undoRedoManager.initialise({ sounds })
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
    return this.undoRedoManager.canUndo
  }

  get canRedo(): boolean {
    return this.undoRedoManager.canRedo
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
    const updatedSounds = this._sounds.filter((sound) => sound.id !== id)
    this.setSounds(updatedSounds)
  }

  duplicateSound = (id: SoundId): void => {
    const sound = this.getSound(id)
    const newSound = { ...sound, id: newSoundId() }
    validateSound(newSound)
    const updatedSounds = [...this._sounds, newSound]
    this.setSounds(updatedSounds)
  }

  importSounds = (sounds: readonly Sound[]) => {
    sounds.forEach(validateSound)
    this.setSounds(sounds)
  }

  undo = (): void => {
    this.checkNotLoading()
    const soundState = this.undoRedoManager.undo()
    if (soundState === undefined) {
      return
    }
    this.setSoundsCore(soundState.sounds)
  }

  redo = (): void => {
    this.checkNotLoading()
    const soundState = this.undoRedoManager.redo()
    if (soundState === undefined) {
      return
    }
    this.setSoundsCore(soundState.sounds)
  }

  private updateSound = (id: SoundId, update: (sound: Draft<Sound>) => void): void =>
    this.updateSoundPure(id, (sound) => produce(sound, update))

  private updateSoundPure = (id: SoundId, update: (sound: Sound) => Sound): void => {
    const currentSound = this.getSound(id)
    const updatedSound = update(currentSound)
    if (_.isEqual(currentSound, updatedSound)) {
      return
    }
    validateSound(updatedSound)
    const updatedSounds = this._sounds.map((sound) => (sound.id === id ? updatedSound : sound))
    this.setSounds(updatedSounds)
  }

  private setSounds = (sounds: readonly Sound[]): void => {
    this.checkNotLoading()
    this.undoRedoManager.change({ sounds })
    this.setSoundsCore(sounds)
  }

  private setSoundsCore = (sounds: readonly Sound[]): void => {
    this._sounds = sounds
    this.soundSyncer.soundsUpdated(sounds)
    this.notifyListeners()
  }

  private checkNotLoading = (): void => {
    if (this._isLoading) {
      throw new Error('Cannot manipulate sounds yet as they are still loading')
    }
  }
}
