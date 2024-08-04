import _ from 'lodash'
import { Option } from './types/Option.ts'

export const unawaited = <T>(promise: Promise<T>): void => void promise

export const fireAndForget = <T>(fn: () => Promise<T>): void => unawaited(fn())

export const doNothing = (): void => undefined

export const concatenateFloat32Arrays = (arrays: Float32Array[]): Float32Array => {
  const totalLength = _.sumBy(arrays, (buffer) => buffer.length)
  const combinedBuffer = new Float32Array(totalLength)
  let offset = 0
  arrays.forEach((buffer) => {
    combinedBuffer.set(buffer, offset)
    offset += buffer.length
  })
  return combinedBuffer
}

export const mapNotUndefined = <T, U>(items: T[], f: (item: T) => Option<U>): U[] =>
  items.map(f).filter((item): item is U => item !== undefined)

export const average = (array: ArrayLike<number>): Option<number> => {
  if (array.length === 0) {
    return undefined
  }
  return _.sum(array) / array.length
}
