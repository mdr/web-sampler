import { Sound, soundHasAudio, SoundWithDefiniteAudio } from '../../types/Sound.ts'
import { expect } from '@playwright/experimental-ct-react'
import * as fs from 'fs/promises'

export function assertSoundHasAudio(sound: Sound): asserts sound is SoundWithDefiniteAudio {
  expect(soundHasAudio(sound)).toBe(true)
}

export const filesAreEqual = async (path1: string, path2: string): Promise<boolean> => {
  const file1 = await fs.readFile(path1)
  const file2 = await fs.readFile(path2)
  return file1.equals(file2)
}
