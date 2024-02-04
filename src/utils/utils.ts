export const unawaited = <T>(promise: Promise<T>): void => void promise

export const fireAndForget = <T>(fn: () => Promise<T>): void => unawaited(fn())

export const doNothing = (): void => undefined

export const todo = <T>(): T => undefined as unknown as T
