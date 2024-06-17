import type CustomMatchers from 'jest-extended'
import 'vitest'

// https://jest-extended.jestcommunity.dev/docs/getting-started/setup#vitest-typescript-types-setup
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-interface
  interface Assertion<T = any> extends CustomMatchers<T> {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-interface
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ExpectStatic extends CustomMatchers<T> {}
}
