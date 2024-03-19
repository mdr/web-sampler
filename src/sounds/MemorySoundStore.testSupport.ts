import { SoundStore } from './SoundStore.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import _ from 'lodash'
import { SoundState } from './SoundState.ts'

export class MemorySoundStore implements SoundStore {
  sounds: Sound[] = []

  constructor(initialSounds: readonly Sound[] = []) {
    this.sounds = [...initialSounds]
  }

  getSoundState = async (): Promise<SoundState> => ({ sounds: [...this.sounds], soundboards: [] })

  bulkUpdate = async (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]): Promise<void> => {
    this.sounds = _.unionBy(soundsToUpsert, this.sounds, 'id')
    _.remove(this.sounds, (sound) => soundIdsToDelete.includes(sound.id))
  }
}
