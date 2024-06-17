import { doNothing, mapNotUndefined } from './utils.ts'
import { describe, expect, it } from 'vitest'
import { Option } from './types/Option.ts'

describe('doNothing', () => {
  it('returns undefined', () => {
    expect(doNothing()).toBeUndefined()
  })
})

describe('mapNotUndefined', () => {
  it('maps and filters out undefined values', () => {
    const items = [1, 2, 3, 4, 5]
    const f = (n: number): Option<number> => (n % 2 === 0 ? n : undefined)
    expect(mapNotUndefined(items, f)).toEqual([2, 4])
  })
})
