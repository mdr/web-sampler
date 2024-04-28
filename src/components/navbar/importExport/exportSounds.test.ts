import { describe, expect, it } from 'vitest'
import { zipSounds } from './exportSounds.ts'
import { unzipSounds } from './importSounds.ts'
import { newSoundId, Sound } from '../../../types/Sound.ts'
import { Samples, Volume } from '../../../utils/types/brandedTypes.ts'
import { SoundTestConstants } from '../../../types/sound.testSupport.ts'

describe('zipSounds', () => {
  it('preserves a collection of sounds on a round trip', async () => {
    const sounds: Sound[] = [
      {
        id: newSoundId(),
        name: 'Sound 1',
        audio: {
          startTime: Samples(0),
          finishTime: Samples(1),
          pcm: SoundTestConstants.pcm,
          volume: Volume(0.5),
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
