import { SoundStore } from './SoundStore.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import _ from 'lodash'

export class MemorySoundStore implements SoundStore {
  sounds: Sound[] = []

  constructor(initialSounds: readonly Sound[] = []) {
    this.sounds = [...initialSounds]
  }

  getAllSounds = async (): Promise<Sound[]> => [...this.sounds]

  bulkUpdate = async (soundsToUpsert: readonly Sound[], soundIdsToDelete: readonly SoundId[]): Promise<void> => {
    this.sounds = _.unionBy(soundsToUpsert, this.sounds, 'id')
    _.remove(this.sounds, (sound) => soundIdsToDelete.includes(sound.id))
  }
}
