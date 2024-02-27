import { describe, expect, it } from 'vitest'
import { zipSounds } from './exportSounds.ts'
import { unzipSounds } from './importSounds.ts'
import { newSoundId, Sound } from '../../../../types/Sound.ts'
import { Pcm, Seconds } from '../../../../utils/types/brandedTypes.ts'

describe('zipSounds', () => {
  it('preserves a collection of sounds on a round trip', async () => {
    const sounds: Sound[] = [
      {
        id: newSoundId(),
        name: 'Sound 1',
        audio: {
          startTime: Seconds(0),
          finishTime: Seconds(1),
          pcm: Pcm(new Float32Array(0)),
          volume: 0.5,
        },
      },
      {
        id: newSoundId(),
        name: 'Sound 2',
      },
    ]

    const zipBlob = await zipSounds(sounds)
    const soundsAgain = await unzipSounds(zipBlob)
    expect(soundsAgain).toEqual(sounds)
  })
})
