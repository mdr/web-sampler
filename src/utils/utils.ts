import _ from 'lodash'

export const unawaited = <T>(promise: Promise<T>): void => void promise

export const fireAndForget = <T>(fn: () => Promise<T>): void => unawaited(fn())

export const doNothing = (): void => undefined

export const todo = <T>(): T => undefined as unknown as T

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
