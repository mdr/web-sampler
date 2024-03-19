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
        throw new Error(`Soundboard ${soundboard.id} references missing sound: ${soundId}`)
      }
    }
  }
}

const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    validateSoundAudio(sound.id, audio)
  }
}

export const validateSoundAudio = (soundId: SoundId, audio: SoundAudio): void => {
  const pcmDuration = getTotalAudioDuration(audio)
  if (audio.startTime < 0) {
    throw new Error(`Sound ${soundId} start time is negative: ${audio.startTime}`)
  }
  if (audio.finishTime > pcmDuration) {
    throw new Error(`Sound ${soundId} finish time is after sound duration: ${audio.finishTime} > ${pcmDuration}`)
  }
  if (audio.finishTime < audio.startTime) {
    throw new Error(`Sound ${soundId} finish time is before start time: ${audio.finishTime} < ${audio.startTime}`)
  }
  for (const sample of audio.pcm) {
    validatePcmSample(soundId, sample)
  }
  if (audio.volume !== undefined && (audio.volume < 0 || audio.volume > 1)) {
    throw new Error(`Sound ${soundId} volume is out of range: ${audio.volume}`)
  }
}

export const validatePcmSample = (soundId: SoundId, sample: number) => {
  if (sample < -1 || sample > 1) {
    throw new Error(`Sound ${soundId} sample is out of range: ${sample}`)
  }
  if (Number.isNaN(sample)) {
    throw new Error(`Sound ${soundId} sample is not a number`)
  }
}
