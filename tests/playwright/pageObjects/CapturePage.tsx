import { expect } from '@playwright/experimental-ct-react'
import { MountResult } from '../types'

export class CapturePage {
  constructor(private readonly mountResult: MountResult) {}

  expectContainsText = async (text: string): Promise<void> => {
    await expect(this.mountResult).toContainText(text)
  }
}
