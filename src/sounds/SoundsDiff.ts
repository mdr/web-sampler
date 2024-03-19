import { Sound, SoundId } from '../types/Sound.ts'
import _ from 'lodash'
import { SoundState } from './SoundState.ts'
import { Soundboard, SoundboardId } from '../types/Soundboard.ts'

export interface SoundsDiff {
  soundsToUpsert: readonly Sound[]
  soundIdsToDelete: readonly SoundId[]
  soundboardsToUpsert: readonly Soundboard[]
  soundboardIdsToDelete: readonly SoundboardId[]
}

export const isDiffEmpty = (diff: SoundsDiff): boolean =>
  diff.soundsToUpsert.length === 0 && diff.soundIdsToDelete.length === 0

export const compareSoundStates = (oldState: SoundState, newState: SoundState): SoundsDiff => {
  const { sounds: oldSounds } = oldState
  const { sounds: newSounds } = newState
  const oldSoundIds = oldSounds.map((sound) => sound.id)
  const newSoundIds = newSounds.map((sound) => sound.id)
  const oldSoundsContains = (sound: Sound): boolean => oldSounds.some((oldSound) => _.isEqual(oldSound, sound))
  const soundsToUpsert = newSounds.filter((sound) => !oldSoundsContains(sound))
  const soundIdsToDelete = _.difference(oldSoundIds, newSoundIds)
  return {
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert: [],
    soundboardIdsToDelete: [],
  }
}
