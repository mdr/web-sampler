import { expect } from '@playwright/experimental-ct-react'
import * as fs from 'fs/promises'

import { Sound, SoundWithDefiniteAudio, soundHasAudio } from '../../types/Sound.ts'
import { Path } from '../../utils/types/brandedTypes.ts'

export function assertSoundHasAudio(sound: Sound): asserts sound is SoundWithDefiniteAudio {
  expect(soundHasAudio(sound), 'Expected sound to have audio, but it did not').toBe(true)
}

export const filesAreEqual = async (path1: Path, path2: Path): Promise<boolean> => {
  const file1 = await fs.readFile(path1)
  const file2 = await fs.readFile(path2)
  return file1.equals(file2)
}
