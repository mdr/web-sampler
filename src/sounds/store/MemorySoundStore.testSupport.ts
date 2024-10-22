import _ from 'lodash'

import { Image } from '../../types/Image.ts'
import { Sound, SoundId } from '../../types/Sound.ts'
import { Soundboard } from '../../types/Soundboard.ts'
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

  // eslint-disable-next-line @typescript-eslint/require-await
  getSoundState = async (): Promise<SoundState> =>
    soundStateSchema.parse({
      sounds: [...this.sounds],
      soundboards: [...this.soundboards],
      images: [...this.images],
    })

  bulkUpdate = ({
    soundsToUpsert,
    soundIdsToDelete,
    soundboardsToUpsert,
    soundboardIdsToDelete,
  }: SoundStateDiff): Promise<void> => {
    this.sounds = _.unionBy(soundsToUpsert, this.sounds, 'id')
    _.remove(this.sounds, (sound) => soundIdsToDelete.includes(sound.id))
    this.soundboards = _.unionBy(soundboardsToUpsert, this.soundboards, 'id')
    _.remove(this.soundboards, (soundboard) => soundboardIdsToDelete.includes(soundboard.id))
    return Promise.resolve()
  }
}
