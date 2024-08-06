import { newSound, newSoundId, Sound, SoundId } from '../../types/Sound.ts'
import { Option } from '../../utils/types/Option.ts'
import _ from 'lodash'
import { SoundActions } from './soundHooks.ts'
import { unawaited } from '../../utils/utils.ts'
import { Samples, Volume } from '../../utils/types/brandedTypes.ts'
import { Draft, produce } from 'immer'
import { pcmLength, pcmSlice } from '../../utils/pcmUtils.ts'
import { newSoundAudio, SoundAudio } from '../../types/SoundAudio.ts'
import { SoundStore } from '../store/SoundStore.ts'
import { SoundSyncer } from '../store/SoundSyncer.ts'
import { UndoRedoManager } from '../UndoRedoManager.ts'
import { validateSoundState } from '../SoundStateValidator.ts'
import { EMPTY_SOUND_STATE, makeSoundState, SoundState } from '../SoundState.ts'
import {
  newSoundboard,
  removeSoundFromSoundboard,
  Soundboard,
  SoundboardId,
  SoundboardTile,
} from '../../types/Soundboard.ts'
import { AudioData } from '../../types/AudioData.ts'
import { KeyboardShortcut } from '../../types/KeyboardShortcut.ts'

export type SoundLibraryUpdatedListener = () => void

/**
 * In-memory storage and manipulation of sounds in the app.
 */
export class SoundLibrary implements SoundActions {
  private _isLoading = true
  private readonly undoRedoManager = new UndoRedoManager<SoundState>(EMPTY_SOUND_STATE)
  private readonly listeners: SoundLibraryUpdatedListener[] = []
  private readonly soundSyncer: SoundSyncer

  constructor(private readonly soundStore: SoundStore) {
    this.soundSyncer = new SoundSyncer(soundStore)
    unawaited(this.loadSounds())
  }

  private loadSounds = async (): Promise<void> => {
    const soundState = await this.soundStore.getSoundState()
    validateSoundState(soundState)
    this.undoRedoManager.initialise(soundState)
    this._isLoading = false
    this.notifyListeners()
    this.soundSyncer.soundsLoaded(soundState)
  }

  get sounds(): readonly Sound[] {
    return this.soundState.sounds
  }

  get soundboards(): readonly Soundboard[] {
    return this.soundState.soundboards
  }

  private get soundState(): SoundState {
    return this.undoRedoManager.getCurrentState()
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

  findSound = (id: SoundId): Option<Sound> => this.sounds.find((sound) => sound.id === id)

  getSound = (id: SoundId): Sound => {
    const sound = this.findSound(id)
    if (sound === undefined) {
      throw new Error(`Sound with id ${id} does not exist`)
    }
    return sound
  }

  private checkSoundExists = (id: SoundId): void => {
    this.getSound(id)
  }

  newSound = (): Sound => {
    const sound: Sound = newSound()
    const updatedSounds = [...this.sounds, sound]
    this.setSounds(updatedSounds)
    return sound
  }

  setName = (id: SoundId, name: string): void =>
    this.updateSound(id, (sound) => {
      sound.name = name
    })

  setAudioData = (id: SoundId, audioData: AudioData) =>
    this.updateSound(id, (sound) => {
      sound.audio = newSoundAudio(audioData)
    })

  setAudioStart = (id: SoundId, start: Samples) =>
    this.updateSoundAudio(id, (audio) => {
      audio.start = start
    })

  setAudioFinish = (id: SoundId, finish: Samples) =>
    this.updateSoundAudio(id, (audio) => {
      audio.finish = finish
    })

  setVolume = (id: SoundId, volume: Volume) =>
    this.updateSoundAudio(id, (audio) => {
      audio.volume = volume
    })

  cropAudio = (id: SoundId) =>
    this.updateSoundAudio(id, (audio) => {
      const croppedPcm = pcmSlice(audio.pcm, audio.start, audio.finish)
      audio.pcm = croppedPcm
      audio.start = Samples(0)
      audio.finish = pcmLength(croppedPcm)
    })

  deleteSound = (id: SoundId): void => {
    const updatedSounds = this.sounds.filter((sound) => sound.id !== id)
    const updatedSoundboards = this.soundboards.map((soundboard) => removeSoundFromSoundboard(soundboard, id))
    const newState = { sounds: updatedSounds, soundboards: updatedSoundboards }
    this.setState(newState)
  }

  duplicateSound = (id: SoundId): void => {
    const sound = this.getSound(id)
    const newSound = { ...sound, id: newSoundId() }
    const updatedSounds = [...this.sounds, newSound]
    this.setSounds(updatedSounds)
  }

  findSoundboard = (id: SoundboardId): Option<Soundboard> => this.soundboards.find((soundboard) => soundboard.id === id)

  getSoundboard = (id: SoundboardId): Soundboard => {
    const soundboard = this.findSoundboard(id)
    if (soundboard === undefined) {
      throw new Error(`Soundboard with id ${id} does not exist`)
    }
    return soundboard
  }

  newSoundboard = (): Soundboard => {
    const soundboard: Soundboard = newSoundboard()
    const updatedSoundboards = [...this.soundboards, soundboard]
    this.setSoundboards(updatedSoundboards)
    return soundboard
  }

  setSoundboardName = (id: SoundboardId, name: string): void =>
    this.updateSoundboard(id, (soundboard) => {
      soundboard.name = name
    })

  addSoundToSoundboard = (soundboardId: SoundboardId, soundId: SoundId): void =>
    this.updateSoundboard(soundboardId, (soundboard) => {
      this.checkSoundExists(soundId)
      const existingSoundIds = soundboard.tiles.map((tile) => tile.soundId)
      if (!existingSoundIds.includes(soundId)) {
        const tile: SoundboardTile = { soundId }
        soundboard.tiles.push(tile)
      }
    })

  removeSoundFromSoundboard = (soundboardId: SoundboardId, soundId: SoundId): void =>
    this.updateSoundboard(soundboardId, (soundboard) => {
      this.checkSoundExists(soundId)
      soundboard.tiles = soundboard.tiles.filter((tile) => tile.soundId !== soundId)
    })

  moveSoundInSoundboard = (soundboardId: SoundboardId, sourceSoundId: SoundId, targetSoundId: Option<SoundId>): void =>
    this.updateSoundboard(soundboardId, (soundboard) => {
      if (sourceSoundId === targetSoundId) {
        return
      }
      const tiles = soundboard.tiles
      const sourceIndex = tiles.findIndex((tile) => tile.soundId === sourceSoundId)
      if (sourceIndex === -1) {
        throw new Error(`Sound ${sourceSoundId} not found in soundboard ${soundboardId}`)
      }
      const sourceTile = tiles[sourceIndex]
      tiles.splice(sourceIndex, 1)
      if (targetSoundId === undefined) {
        tiles.push(sourceTile)
      } else {
        const targetIndex = tiles.findIndex((tile) => tile.soundId === targetSoundId)
        if (targetIndex === -1) {
          throw new Error(`Sound ${targetSoundId} not found in soundboard ${soundboardId}`)
        }
        tiles.splice(targetIndex, 0, sourceTile)
      }
    })

  setSoundboardTileShortcut = (soundboardId: SoundboardId, soundId: SoundId, shortcut: Option<KeyboardShortcut>) =>
    this.updateSoundboard(soundboardId, (soundboard) => {
      const tile = soundboard.tiles.find((tile) => tile.soundId === soundId)
      if (tile === undefined) {
        throw new Error(`Sound ${soundId} not found in soundboard ${soundboardId}`)
      }
      tile.shortcut = shortcut
    })

  updateSoundboard = (id: SoundboardId, update: (soundboard: Draft<Soundboard>) => void): void =>
    this.updateSoundboardPure(id, (soundboard) => produce(soundboard, update))

  updateSoundboardPure = (id: SoundboardId, update: (soundboard: Soundboard) => Soundboard): void => {
    const currentSoundboard = this.getSoundboard(id)
    const updatedSoundboard = update(currentSoundboard)
    if (_.isEqual(currentSoundboard, updatedSoundboard)) {
      return
    }
    const updatedSoundboards = this.soundboards.map((soundboard) =>
      soundboard.id === id ? updatedSoundboard : soundboard,
    )
    this.setSoundboards(updatedSoundboards)
  }

  importSounds = (sounds: readonly Sound[]) => {
    this.setState(makeSoundState({ sounds }))
  }

  undo = (): void => {
    this.checkNotLoading()
    const soundState = this.undoRedoManager.undo()
    if (soundState === undefined) {
      return
    }
    this.soundSyncer.soundsUpdated(soundState)
    this.notifyListeners()
  }

  redo = (): void => {
    this.checkNotLoading()
    const soundState = this.undoRedoManager.redo()
    if (soundState === undefined) {
      return
    }
    this.soundSyncer.soundsUpdated(soundState)
    this.notifyListeners()
  }

  private updateSound = (id: SoundId, update: (sound: Draft<Sound>) => void): void =>
    this.updateSoundPure(id, (sound) => produce(sound, update))

  private updateSoundAudio = (id: SoundId, update: (audio: Draft<SoundAudio>) => void): void => {
    this.updateSound(id, (sound) => {
      if (sound.audio === undefined) {
        throw Error(`No audio defined for sound ${sound.id}`)
      }
      update(sound.audio)
    })
  }

  private updateSoundPure = (id: SoundId, update: (sound: Sound) => Sound): void => {
    const currentSound = this.getSound(id)
    const updatedSound = update(currentSound)
    if (_.isEqual(currentSound, updatedSound)) {
      return
    }
    const updatedSounds = this.sounds.map((sound) => (sound.id === id ? updatedSound : sound))
    this.setSounds(updatedSounds)
  }

  private setSounds = (sounds: readonly Sound[]): void => {
    const newState = { ...this.soundState, sounds }
    this.setState(newState)
  }

  private setSoundboards = (soundboards: readonly Soundboard[]): void => {
    const newState = { ...this.soundState, soundboards }
    this.setState(newState)
  }

  private setState = (state: SoundState): void => {
    this.checkNotLoading()
    validateSoundState(state)
    this.undoRedoManager.change(state)
    this.soundSyncer.soundsUpdated(state)
    this.notifyListeners()
  }

  private checkNotLoading = (): void => {
    if (this._isLoading) {
      throw new Error('Cannot manipulate sounds yet as they are still loading')
    }
  }
}
