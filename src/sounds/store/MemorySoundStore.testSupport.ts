import _ from 'lodash'

import { Image, ImageId } from '../../types/Image.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard, SoundboardId } from '../../types/Soundboard.ts'
import { SoundState, soundStateSchema } from '../SoundState.ts'
import { SoundStateDiff } from '../SoundStateDiff.ts'
import { SoundStore } from './SoundStore.ts'

export class MemorySoundStore implements SoundStore {
  sounds: Sound[] = []
  soundboards: Soundboard[] = []
  images: Image[] = []

  constructor(
    initialSounds: readonly Sound[] = [],
    initialSoundboards: readonly Soundboard[] = [],
    initialImages: readonly Image[] = [],
  ) {
    this.sounds = [...initialSounds]
    this.soundboards = [...initialSoundboards]
    this.images = [...initialImages]
  }

  getSound = (soundId: SoundId): Sound => {
    const sound = this.sounds.find((sound) => sound.id === soundId)
    if (sound === undefined) {
      throw new Error(`Sound with id ${soundId} does not exist`)
    }
    return sound
  }

  getSoundboard = (soundboardId: SoundboardId): Soundboard => {
    const soundboard = this.soundboards.find((soundboard) => soundboard.id === soundboardId)
    if (soundboard === undefined) {
      throw new Error(`Soundboard with id ${soundboardId} does not exist`)
    }
    return soundboard
  }

  getImage = (imageId: ImageId): Image => {
    const image = this.images.find((image) => image.id === imageId)
    if (image === undefined) {
      throw new Error(`Image with id ${imageId} does not exist`)
    }
    return image
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  getSoundState = async (): Promise<SoundState> =>
    soundStateSchema.parse({
      sounds: [...this.sounds],
      soundboards: [...this.soundboards],
      images: [...this.images],
    })

  // eslint-disable-next-line @typescript-eslint/require-await
  bulkUpdate = async ({
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
    imagesToUpsert,
    imageIdsToDelete,
  }: SoundStateDiff): Promise<void> => {
    this.sounds = _.unionBy(soundsToUpsert, this.sounds, 'id')
    _.remove(this.sounds, (sound) => soundIdsToDelete.includes(sound.id))
    this.soundboards = _.unionBy(soundboardsToUpsert, this.soundboards, 'id')
    _.remove(this.soundboards, (soundboard) => soundboardIdsToDelete.includes(soundboard.id))
    this.images = _.unionBy(imagesToUpsert, this.images, 'id')
    _.remove(this.images, (image) => imageIdsToDelete.includes(image.id))
  }
}
