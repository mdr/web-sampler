import { test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { TestId } from '../../../utils/types/TestId.ts'

export class PageObject {
  constructor(protected readonly mountResult: MountResult) {}

  protected step = <T>(name: string, body: () => T | Promise<T>): Promise<T> =>
    test.step(`${this.constructor.name}.${name}`, body)

  protected click = (testId: TestId): Promise<void> => this.mountResult.getByTestId(testId).click()
}
