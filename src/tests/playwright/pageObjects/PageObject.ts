import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { Duration } from 'luxon'
import { TestId } from '../../../utils/types/brandedTypes.ts'

export abstract class PageObject {
  constructor(protected readonly mountResult: MountResult) {}

  protected get page() {
    return this.mountResult.page()
  }

  protected abstract readonly name: string

  protected step = <T>(name: string, body: () => T | Promise<T>): Promise<T> => test.step(`${this.name}.${name}`, body)

  protected get = (testId: TestId) => this.mountResult.getByTestId(testId)

  protected press = (testId: TestId): Promise<void> => this.get(testId).click()

  protected expectToBeVisible = (testId: TestId): Promise<void> => expect(this.get(testId)).toBeVisible()

  protected expectToBeVisibleImmediate = (testId: TestId): Promise<void> =>
    expect(this.get(testId)).toBeVisible({ timeout: 1 })

  public wait = (duration: Duration): Promise<void> =>
    this.step(`wait ${duration.toHuman()}`, () =>
      this.page.evaluate((millis) => window.testHooks.clockTick(millis), duration.toMillis()),
    )

  public hardWait = (duration: Duration): Promise<void> =>
    this.step(`hardWait ${duration.toHuman()}`, () => this.page.waitForTimeout(duration.toMillis()))

  public checkScreenshot = (name: string) => expect(this.mountResult).toHaveScreenshot(`${name}.png`)
}