import { AudioData } from '../types/AudioData.ts'
import { Mp3Encoder } from '@breezystack/lamejs'

export const pcmToMp3Blob = (audioData: AudioData): Blob => {
  const mp3Encoder = new Mp3Encoder(1, audioData.sampleRate, 128)
  const samples = new Int16Array(audioData.pcm.length)
  for (let i = 0; i < audioData.pcm.length; i++) {
    samples[i] = audioData.pcm[i] * 0x7fff
  }
  const sampleBlockSize = 1152 //can be anything but make it a multiple of 576 to make encoders life easier
  const mp3Data = []
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = samples.subarray(i, i + sampleBlockSize)
    const mp3buf = mp3Encoder.encodeBuffer(sampleChunk)
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }
  }
  const mp3buf = mp3Encoder.flush()
  if (mp3buf.length > 0) {
    mp3Data.push(new Int8Array(mp3buf))
  }
  return new Blob(mp3Data, { type: 'audio/mp3' })
}
