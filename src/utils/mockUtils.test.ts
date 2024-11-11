import { describe, expect, it, test, vi } from 'vitest'

import { mockObjectMethods } from './mockUtils.testSupport.ts'

class Math {
  double(x: number): number {
    return x * 2
  }
}

describe('mockObjectMethods', () => {
  it('should create a mock for methods on the original object', () => {
    const math = { double: vi.fn((x: number) => x * 2) }

    const mockedMath = mockObjectMethods(math)

    expect(mockedMath.double).not.toBe(math.double)
    mockedMath.double.mockImplementation((x: number) => x * 3)
    expect(mockedMath.double(5)).toBe(15)
  })

  test('mocks for class methods should be created', () => {
    const math = new Math()

    const mockedMath = mockObjectMethods(math)

    expect(mockedMath.double).not.toBe(math.double)
    mockedMath.double.mockImplementation((x: number) => x * 3)
    expect(mockedMath.double(5)).toBe(15)
  })

  test('mocked methods should call through to the original object by default', () => {
    const math = { double: vi.fn((x: number) => x * 2) }

    const mockedMath = mockObjectMethods(math)

    const result = mockedMath.double(5)
    expect(result).toBe(10)
  })

  it('should cache mocks for methods', () => {
    const math = { double: vi.fn((x: number) => x * 2) }

    const mockedMath = mockObjectMethods(math)

    const double1 = mockedMath.double
    const double2 = mockedMath.double
    expect(double1).toBe(double2)
  })

  it('should not mock non-function properties', () => {
    const math = { pi: 3.14159 }

    const mockedMath = mockObjectMethods(math)

    expect(mockedMath.pi).toBe(3.14159)
  })
})
