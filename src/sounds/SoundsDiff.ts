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
  diff.soundsToUpsert.length === 0 &&
  diff.soundIdsToDelete.length === 0 &&
  diff.soundboardsToUpsert.length === 0 &&
  diff.soundboardIdsToDelete.length === 0

const compareItems = <Id, T extends { id: Id }>(
  oldItems: readonly T[],
  newItems: readonly T[],
): {
  itemsToUpsert: T[]
  itemIdsToDelete: Id[]
} => {
  const oldItemIds = oldItems.map((item) => item.id)
  const newItemIds = newItems.map((item) => item.id)
  const oldItemsContains = (item: T): boolean => oldItems.some((oldItem) => _.isEqual(oldItem, item))
  const itemsToUpsert = newItems.filter((item) => !oldItemsContains(item))
  const itemIdsToDelete = _.difference(oldItemIds, newItemIds)
  return { itemsToUpsert, itemIdsToDelete }
}

export const compareSoundStates = (oldState: SoundState, newState: SoundState): SoundsDiff => {
  const { sounds: oldSounds, soundboards: oldSoundboards } = oldState
  const { sounds: newSounds, soundboards: newSoundboards } = newState

  const { itemsToUpsert: soundsToUpsert, itemIdsToDelete: soundIdsToDelete } = compareItems<SoundId, Sound>(
    oldSounds,
    newSounds,
  )

  const { itemsToUpsert: soundboardsToUpsert, itemIdsToDelete: soundboardIdsToDelete } = compareItems<
    SoundboardId,
    Soundboard
  >(oldSoundboards, newSoundboards)

  return { soundsToUpsert, soundIdsToDelete, soundboardsToUpsert, soundboardIdsToDelete }
}
