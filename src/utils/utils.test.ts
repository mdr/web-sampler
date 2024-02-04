import { doNothing } from './utils.ts'
import { describe, expect, it } from 'vitest'

describe('doNothing', () => {
  it('returns undefined', () => {
    expect(doNothing()).toBeUndefined()
  })
})
