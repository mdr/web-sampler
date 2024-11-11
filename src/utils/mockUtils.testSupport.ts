import { Mock, vi } from 'vitest'

/**
 * Create a mock of the given function type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFunction = <T extends (...args: any) => any>(): Mock<T> => vi.fn()

export const mockObjectMethods = <T extends object>(obj: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const mockCache = new WeakMap<object, Map<string | symbol, Function>>()
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver)
      if (typeof originalValue === 'function') {
        let targetCache = mockCache.get(target)
        if (!targetCache) {
          targetCache = new Map()
          mockCache.set(target, targetCache)
        }
        if (!targetCache.has(prop)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
          const mockedFn = vi.fn((...args: any[]) => originalValue.apply(target, args))
          targetCache.set(prop, mockedFn)
        }
        return targetCache.get(prop)
      }
      return originalValue
    },
  })
}
