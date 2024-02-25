import { Sound, soundHasAudio, SoundWithDefiniteAudio } from '../../types/Sound.ts'
import { expect } from '@playwright/experimental-ct-react'

export function assertSoundHasAudio(sound: Sound): asserts sound is SoundWithDefiniteAudio {
  expect(soundHasAudio(sound)).toBe(true)
}
