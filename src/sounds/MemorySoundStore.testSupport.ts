import { BulkSoundUpdate, SoundStore } from './SoundStore.ts'
import { Sound } from '../types/Sound.ts'
import _ from 'lodash'
import { SoundState } from './SoundState.ts'
import { Soundboard } from '../types/Soundboard.ts'

export class MemorySoundStore implements SoundStore {
  sounds: Sound[] = []
  soundboards: Soundboard[] = []

  constructor(initialSounds: readonly Sound[] = [], initialSoundboards: readonly Soundboard[] = []) {
    this.sounds = [...initialSounds]
    this.soundboards = [...initialSoundboards]
  }

  getSoundState = async (): Promise<SoundState> => ({ sounds: [...this.sounds], soundboards: [...this.soundboards] })

  bulkUpdate = async ({ soundsToUpsert, soundIdsToDelete }: BulkSoundUpdate): Promise<void> => {
    this.sounds = _.unionBy(soundsToUpsert, this.sounds, 'id')
    _.remove(this.sounds, (sound) => soundIdsToDelete.includes(sound.id))
  }
}
