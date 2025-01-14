import _ from 'lodash'

import { Image, ImageId } from '../types/Image.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { Soundboard, SoundboardId } from '../types/Soundboard.ts'
import { SoundState } from './SoundState.ts'

export interface SoundStateDiff {
  soundsToUpsert: readonly Sound[]
  soundIdsToDelete: readonly SoundId[]
  soundboardsToUpsert: readonly Soundboard[]
  soundboardIdsToDelete: readonly SoundboardId[]
  imagesToUpsert: readonly Image[]
  imageIdsToDelete: readonly ImageId[]
}

export const makeSoundStateDiff = ({
  soundsToUpsert = [],
  soundIdsToDelete = [],
  soundboardsToUpsert = [],
  soundboardIdsToDelete = [],
  imagesToUpsert = [],
  imageIdsToDelete = [],
}: Partial<SoundStateDiff> = {}): SoundStateDiff => ({
  soundsToUpsert,
  soundIdsToDelete,
  soundboardsToUpsert,
  soundboardIdsToDelete,
  imagesToUpsert,
  imageIdsToDelete,
})

export const isDiffEmpty = (diff: SoundStateDiff): boolean =>
  diff.soundsToUpsert.length === 0 &&
  diff.soundIdsToDelete.length === 0 &&
  diff.soundboardsToUpsert.length === 0 &&
  diff.soundboardIdsToDelete.length === 0 &&
  diff.imagesToUpsert.length === 0 &&
  diff.imageIdsToDelete.length === 0

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

export const compareSoundStates = (oldState: SoundState, newState: SoundState): SoundStateDiff => {
  const { sounds: oldSounds, soundboards: oldSoundboards, images: oldImages } = oldState
  const { sounds: newSounds, soundboards: newSoundboards, images: newImages } = newState

  const { itemsToUpsert: soundsToUpsert, itemIdsToDelete: soundIdsToDelete } = compareItems<SoundId, Sound>(
    oldSounds,
    newSounds,
  )

  const { itemsToUpsert: soundboardsToUpsert, itemIdsToDelete: soundboardIdsToDelete } = compareItems<
    SoundboardId,
    Soundboard
  >(oldSoundboards, newSoundboards)

  const { itemsToUpsert: imagesToUpsert, itemIdsToDelete: imageIdsToDelete } = compareItems<ImageId, Image>(
    oldImages,
    newImages,
  )

  return {
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
    imagesToUpsert,
    imageIdsToDelete,
  }
}
