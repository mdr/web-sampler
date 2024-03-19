import { SoundState } from './SoundState.ts'
import { Sound, SoundId } from '../types/Sound.ts'
import { getTotalAudioDuration, SoundAudio } from '../types/SoundAudio.ts'

export const validateSoundState = (soundState: SoundState): void => new SoundStateValidator(soundState).validate()

class SoundStateValidator {
  constructor(private readonly soundState: SoundState) {}

  validate = () => {
    this.soundState.sounds.forEach(validateSound)
  }
}

export const validateSound = (sound: Sound): void => {
  const audio = sound.audio
  if (audio !== undefined) {
    validateSoundAudio(sound.id, audio)
  }
}

const validateSoundAudio = (soundId: SoundId, audio: SoundAudio): void => {
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
    if (sample < -1 || sample > 1) {
      throw new Error(`Sound ${soundId} sample is out of range: ${sample}`)
    }
  }
  if (audio.volume !== undefined && (audio.volume < 0 || audio.volume > 1)) {
    throw new Error(`Sound ${soundId} volume is out of range: ${audio.volume}`)
  }
}
