import { describe, expect, it } from 'vitest'

import { fileToUint8Array } from './fileUtils.ts'

describe('fileToUint8Array', () => {
  it('should convert a File to a Uint8Array', async () => {
    const fileContent = new Uint8Array([65, 66, 67])
    const file = new File([fileContent], 'test.txt', { type: 'text/plain' })

    const result = await fileToUint8Array(file)

    expect(result).toEqual(fileContent)
  })

  it('should reject the promise if the conversion fails', async () => {
    const invalidFile = {} as File

    await expect(fileToUint8Array(invalidFile)).rejects.toThrow()
  })
})
