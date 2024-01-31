import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { TestId } from '../../../utils/types/TestId.ts'
import { Duration, TimeDuration } from 'typed-duration'

export class PageObject {
  constructor(protected readonly mountResult: MountResult) {}

  protected get page() {
    return this.mountResult.page()
  }

  protected step = <T>(name: string, body: () => T | Promise<T>): Promise<T> =>
    test.step(`${this.constructor.name}.${name}`, body)

  protected click = (testId: TestId): Promise<void> => this.mountResult.getByTestId(testId).click()

  public wait = (duration: TimeDuration): Promise<void> =>
    this.step('wait', () =>
      this.page.evaluate((millis) => window.testHooks.clockTick(millis), Duration.milliseconds.from(duration)),
    )

  public checkScreenshot = (name: string) => expect(this.mountResult).toHaveScreenshot(`${name}.png`)
}
