import { Sound, SoundId } from '../types/Sound.ts'
import _ from 'lodash'
import { State } from './SoundSyncer.ts'

export interface SoundsDiff {
  soundsToUpsert: readonly Sound[]
  soundIdsToDelete: readonly SoundId[]
}

export const diffSounds = (oldState: State, newState: State): SoundsDiff => {
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
  }
}
