import { describe, expect, it } from 'vitest'

import { Option } from './types/Option.ts'
import { average, concatenateFloat32Arrays, doNothing, mapNotUndefined } from './utils.ts'

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

describe('concatenateFloat32Arrays', () => {
  it('should concatenate arrays', () => {
    const array1 = new Float32Array([1, 2, 3])
    const array2 = new Float32Array([4, 5, 6])
    const array3 = new Float32Array([7, 8, 9])

    const combined = concatenateFloat32Arrays([array1, array2, array3])

    expect(combined).toEqual(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  })

  it('should handle an empty array of arrays', () => {
    expect(concatenateFloat32Arrays([])).toEqual(new Float32Array([]))
  })
})

describe('average', () => {
  it('should work on non-empty arrays', () => {
    expect(average([1, 2, 3])).toEqual(2)
  })
  it('should return undefined on empty arrays', () => {
    const items: number[] = []
    expect(average(items)).toBeUndefined()
  })
})
