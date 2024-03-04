import { Sound, SoundId } from '../types/Sound.ts'
import _ from 'lodash'

export interface SoundsDiff {
  soundsToUpsert: readonly Sound[]
  soundIdsToDelete: readonly SoundId[]
}

export const diffSounds = (oldSounds: readonly Sound[], newSounds: readonly Sound[]): SoundsDiff => {
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
