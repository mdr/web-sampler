import { Brand } from 'effect'

export type TestId = string & Brand.Brand<'TestId'>
export const TestId = Brand.nominal<TestId>()

export type Url = string & Brand.Brand<'Url'>
export const Url = Brand.nominal<Url>()

export type Seconds = number & Brand.Brand<'Seconds'>
export const Seconds = Brand.nominal<Seconds>()

export type Pcm = Float32Array & Brand.Brand<'Pcm'>
export const Pcm = Brand.nominal<Pcm>()
