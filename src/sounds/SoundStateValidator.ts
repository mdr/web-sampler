import { SoundState } from './SoundState.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { getTotalAudioDuration, SoundAudio } from '../types/SoundAudio.ts'
import { Soundboard } from '../types/Soundboard.ts'

export const validateSoundState = (soundState: SoundState): void => new SoundStateValidator(soundState).validate()

class SoundStateValidator {
  constructor(private readonly soundState: SoundState) {}

  validate = () => {
    this.soundState.sounds.forEach(validateSound)
    this.soundState.soundboards.forEach(this.validateSoundboard)
  }

  private validateSoundboard = (soundboard: Soundboard) => {
    const sounds = this.soundState.sounds
    for (const soundId of soundboard.sounds) {
      if (!sounds.some((sound) => sound.id === soundId)) {
        throw new SoundValidationError(`Soundboard ${soundboard.id} references missing sound: ${soundId}`)
      }
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
  const pcmDuration = getTotalAudioDuration(audio)
  if (audio.startTime < 0) {
    throw new SoundValidationError(`Sound ${soundId} start time is negative: ${audio.startTime}`)
  }
  if (audio.finishTime > pcmDuration) {
    throw new SoundValidationError(
      `Sound ${soundId} finish time is after sound duration: ${audio.finishTime} > ${pcmDuration}`,
    )
  }
  if (audio.finishTime < audio.startTime) {
    throw new SoundValidationError(
      `Sound ${soundId} finish time is before start time: ${audio.finishTime} < ${audio.startTime}`,
    )
  }
  for (const sample of audio.pcm) {
    validatePcmSample(soundId, sample)
  }
  if (audio.volume !== undefined && (audio.volume < 0 || audio.volume > 1)) {
    throw new SoundValidationError(`Sound ${soundId} volume is out of range: ${audio.volume}`)
  }
}

export const validatePcmSample = (soundId: SoundId, sample: number) => {
  if (Number.isNaN(sample)) {
    throw new SoundValidationError(`Sound ${soundId} sample is not a number`)
  }
  if (!(-1 <= sample && sample <= 1)) {
    throw new SoundValidationError(`Sound ${soundId} sample is out of range: ${sample}`)
  }
}

class SoundValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SoundValidationError'
  }
}
