import { Brand } from 'effect'

export const unawaited = <T>(promise: Promise<T>): void => void promise

export const fireAndForget = <T>(fn: () => Promise<T>): void => unawaited(fn())

export const doNothing = (): void => undefined

export const todo = <T>(): T => undefined as unknown as T

export type ObjectId = number & Brand.Brand<'ObjectId'>

export const ObjectId = Brand.nominal<ObjectId>()

let currentId: ObjectId = ObjectId(0)
const objectIdMap = new WeakMap<object, ObjectId>()

export const getUniqueIdForObject = (obj: object): ObjectId => {
  const objectId = objectIdMap.get(obj)
  if (objectId !== undefined) {
    return objectId
  } else {
    currentId++
    objectIdMap.set(obj, currentId)
    return currentId
  }
}
