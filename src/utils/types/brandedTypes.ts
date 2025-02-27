import { Brand } from 'effect'

export type TestId = string & Brand.Brand<'TestId'>
export const TestId = Brand.nominal<TestId>()

export type Url = string & Brand.Brand<'Url'>
export const Url = Brand.nominal<Url>()

export type Seconds = number & Brand.Brand<'Seconds'>
export const Seconds = Brand.nominal<Seconds>()

export type Millis = number & Brand.Brand<'Millis'>
export const Millis = Brand.nominal<Millis>()

export const secondsToMillis = (seconds: Seconds): Millis => Millis(seconds * 1000)

// Mono
export type Pcm = Float32Array & Brand.Brand<'Pcm'>
export const Pcm = Brand.nominal<Pcm>()

export type Pixels = number & Brand.Brand<'Pixels'>
export const Pixels = Brand.nominal<Pixels>()

export type Hz = number & Brand.Brand<'Hz'>
export const Hz = Brand.nominal<Hz>()

// a count of samples or an index into a PCM array
export type Samples = number & Brand.Brand<'Samples'>
export const Samples = Brand.refined<Samples>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer number of samples`),
)

export type Path = string & Brand.Brand<'Path'>
export const Path = Brand.nominal<Path>()

// Volume between 0 and 1 inclusive
export type Volume = number & Brand.Brand<'Volume'>
export const Volume = Brand.refined<Volume>(
  (n) => 0 <= n && n <= 1,
  (n) => Brand.error(`Expected volume value ${n} to be between 0 and 1 inclusive`),
)

export const MIN_VOLUME: Volume = Volume(0)
export const MAX_VOLUME: Volume = Volume(1)

export type ImageBytes = Uint8Array & Brand.Brand<'ImageBytes'>
export const ImageBytes = Brand.nominal<ImageBytes>()

export type MediaType = string & Brand.Brand<'MediaType'>
export const MediaType = Brand.nominal<MediaType>()

export const JPEG_MEDIA_TYPE = MediaType('image/jpeg')

export type Percent = number & Brand.Brand<'Percent'>
export const Percent = Brand.nominal<Percent>()
