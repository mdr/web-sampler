// Adapted from https://github.com/Experience-Monks/audiobuffer-to-wav (MIT License)
// itself adapted from https://github.com/mattdiamond/Recorderjs (MIT License)
import { Hz } from './types/brandedTypes.ts'
import { DEFAULT_SAMPLE_RATE } from '../types/soundConstants.ts'
import { AUDIO_WAV } from './mediaTypes.ts'
import { AudioData } from '../types/AudioData.ts'

export const pcmToWavBlob = ({ pcm, sampleRate }: AudioData): Blob =>
  new Blob([pcmToWav(pcm, sampleRate)], { type: AUDIO_WAV })

const pcmToWav = (pcm: Float32Array, sampleRate: Hz): ArrayBuffer => encodeWav(pcm, { sampleRate })

interface EncodeWavOptions {
  readonly format?: 1 | 3
  readonly sampleRate?: Hz
  readonly numChannels?: 1 | 2
  readonly bitDepth?: 16 | 32
}

const encodeWav = (
  samples: Float32Array,
  { format = 1, sampleRate = DEFAULT_SAMPLE_RATE, numChannels = 1, bitDepth = 16 }: EncodeWavOptions = {},
): ArrayBuffer => {
  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample

  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  const view = new DataView(buffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, 'data')
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) {
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

const writeFloat32 = (output: DataView, offset: number, input: Float32Array): void => {
  for (let i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array): void => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}

const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
