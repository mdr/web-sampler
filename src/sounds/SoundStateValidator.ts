import { SoundState } from './SoundState.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { getTotalNumberOfSamples, SoundAudio } from '../types/SoundAudio.ts'
import { Soundboard } from '../types/Soundboard.ts'
import { MAX_VOLUME, MIN_VOLUME } from '../utils/types/brandedTypes.ts'

export const validateSoundState = (soundState: SoundState): void => new SoundStateValidator(soundState).validate()

class SoundStateValidator {
  constructor(private readonly soundState: SoundState) {}

  validate = () => {
    this.soundState.sounds.forEach(validateSound)
    this.soundState.soundboards.forEach(this.validateSoundboard)
  }

  private validateSoundboard = (soundboard: Soundboard) => {
    const sounds = this.soundState.sounds
    const seenSoundIds = new Set<SoundId>()
    for (const soundId of soundboard.sounds) {
      if (!sounds.some((sound) => sound.id === soundId)) {
        throw new SoundValidationError(`Soundboard ${soundboard.id} references missing sound: ${soundId}`)
      }
      if (seenSoundIds.has(soundId)) {
        throw new SoundValidationError(`Soundboard ${soundboard.id} contains duplicate sound ID: ${soundId}`)
      }
      seenSoundIds.add(soundId)
    }
  }
}

export const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    validateSoundAudio(sound.id, audio)
  }
}

export const validateSoundAudio = (soundId: SoundId, audio: SoundAudio): void => {
  const totalSamples = getTotalNumberOfSamples(audio)
  if (audio.start < 0) {
    throw new SoundValidationError(`Sound ${soundId} start time is negative: ${audio.start}`)
  }
  if (audio.finish > totalSamples) {
    throw new SoundValidationError(
      `Sound ${soundId} finish time is after sound duration: ${audio.finish} > ${totalSamples}`,
    )
  }
  if (audio.finish < audio.start) {
    throw new SoundValidationError(
      `Sound ${soundId} finish time is before start time: ${audio.finish} < ${audio.start}`,
    )
  }
  for (const sample of audio.pcm) {
    validatePcmSample(soundId, sample)
  }
  if (Number.isNaN(audio.sampleRate) || audio.sampleRate <= 0) {
    throw new SoundValidationError(`Sound ${soundId} sample rate is not positive: ${audio.sampleRate}`)
  }
  if (audio.volume < MIN_VOLUME || audio.volume > MAX_VOLUME) {
    throw new SoundValidationError(`Sound ${soundId} volume is out of range: ${audio.volume}`)
  }
}

export const validatePcmSample = (soundId: SoundId, sample: number) => {
  if (Number.isNaN(sample)) {
    throw new SoundValidationError(`Sound ${soundId} sample is not a number`)
  }
  const sampleInRange = -1 <= sample && sample <= 1
  if (!sampleInRange) {
    throw new SoundValidationError(`Sound ${soundId} sample is out of range: ${sample}`)
  }
}

class SoundValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SoundValidationError'
  }
}
