import { Mock, Mocked, vi } from 'vitest'

/**
 * Create a mock of the given function type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFunction = <T extends (...args: any) => any>(): Mock<T> => vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type FunctionMap = Map<string | symbol, Function>

/**
 * Mock every method on the given object, defaulting to the original implementation.
 */
export const mockObjectMethods = <T extends object>(obj: T): Mocked<T> => {
  const functionMap: FunctionMap = new Map()
  // The assertion is required by tsc, but the rule misreads the generic Proxy type
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver)
      if (typeof originalValue === 'function') {
        if (!functionMap.has(prop)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
          const mockedFn = vi.fn((...args: any[]) => originalValue.apply(target, args))
          functionMap.set(prop, mockedFn)
        }
        return functionMap.get(prop)
      }
      return originalValue
    },
  }) as Mocked<T>
}
