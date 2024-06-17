import { deserialize, serialize, SerializedRecord } from '@ungap/structured-clone'
import { Sound } from '../../../types/Sound.ts'

export const serialiseSounds = (sounds: readonly Sound[]): string => {
  // Need a structured clone serialisation step to handle Float32Array in the sound data
  const serializedSounds = serialize(sounds)
  return JSON.stringify(serializedSounds, null, 2)
}

export const deserialiseSounds = (jsonString: string): Sound[] => {
  const serialisedSounds = JSON.parse(jsonString) as SerializedRecord
  return deserialize(serialisedSounds) as Sound[]
}
