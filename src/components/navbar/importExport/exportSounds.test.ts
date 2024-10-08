import { describe, expect, it } from 'vitest'

import { Sound, newSoundId } from '../../../types/Sound.ts'
import { SoundTestConstants } from '../../../types/sound.testSupport.ts'
import { Samples, Volume } from '../../../utils/types/brandedTypes.ts'
import { zipSounds } from './exportSounds.ts'
import { unzipSounds } from './importSounds.ts'

describe('zipSounds', () => {
  it('preserves a collection of sounds on a round trip', async () => {
    const sounds: Sound[] = [
      {
        id: newSoundId(),
        name: 'Sound 1',
        audio: {
          pcm: SoundTestConstants.pcm,
          sampleRate: SoundTestConstants.sampleRate,
          start: Samples(0),
          finish: Samples(1),
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
