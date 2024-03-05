import { Mock, vi } from 'vitest'

/**
 * Create a mock of the given function type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFunction = <T extends (...args: any) => any>(): Mock<Parameters<T>, ReturnType<T>> => vi.fn()
