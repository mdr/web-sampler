import { expect, test } from '@playwright/experimental-ct-react'
import { MountResult } from '../types.ts'
import { Duration } from 'luxon'
import { TestId } from '../../../utils/types/brandedTypes.ts'
import { platform } from 'node:os'
import { Option } from '../../../utils/types/Option.ts'

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

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step(`expectToastToBeShown "${message}"`, () => expect(this.mountResult.getByText(message)).toBeVisible())

  expectAudioToBePlaying = async (playing: boolean): Promise<void> =>
    this.step(`expectAudioToBePlaying ${playing}`, async () => {
      expect(await this.isAudioPlaying()).toBe(playing)
    })

  isAudioPlaying = (): Promise<boolean> => this.page.evaluate(() => window.testHooks.isAudioPlaying)

  wait = (duration: Duration): Promise<void> =>
    this.step(`wait ${duration.toHuman()}`, () =>
      this.page.evaluate((millis) => window.testHooks.clockTick(millis), duration.toMillis()),
    )

  checkScreenshot = async (name: string, testId: Option<TestId> = undefined): Promise<void> => {
    if (platform() !== 'linux') {
      return
    }
    if (testId !== undefined) {
      await expect(this.get(testId)).toHaveScreenshot(`${name}.png`)
    } else {
      await expect(this.mountResult).toHaveScreenshot(`${name}.png`)
    }
  }
}
