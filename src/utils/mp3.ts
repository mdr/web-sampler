import { Mp3Encoder } from '@breezystack/lamejs'

import { AudioData } from '../types/AudioData.ts'
import { Pcm } from './types/brandedTypes.ts'

export const pcmToMp3Blob = (audioData: AudioData): Blob => {
  const mp3Encoder = new Mp3Encoder(1, audioData.sampleRate, 128)
  const pcm16 = to16BitPcm(audioData.pcm)
  const sampleBlockSize = 1152 //can be anything but make it a multiple of 576 to make encoders life easier
  const mp3Data = []
  for (let i = 0; i < pcm16.length; i += sampleBlockSize) {
    const sampleChunk = pcm16.subarray(i, i + sampleBlockSize)
    const mp3buf = mp3Encoder.encodeBuffer(sampleChunk)
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }
  }
  const mp3buf = mp3Encoder.flush()
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf)
  }
  return new Blob(mp3Data, { type: 'audio/mp3' })
}

const to16BitPcm = (pcm: Pcm): Int16Array => {
  const pcm16 = new Int16Array(pcm.length)
  for (let i = 0; i < pcm.length; i++) {
    pcm16[i] = pcm[i] * 0x7fff
  }
  return pcm16
}
