import { expect, MountResult, test } from '@playwright/experimental-ct-react'
import { Duration } from 'luxon'
import { Path, Seconds, TestId, Volume } from '../../../utils/types/brandedTypes.ts'
import { platform } from 'node:os'
import { Option } from '../../../utils/types/Option.ts'
import { Sound } from '../../../types/Sound.ts'
import { deserialiseSounds } from '../testApp/soundsSerialisation.ts'
import tmp from 'tmp'

export abstract class PageObject {
  constructor(protected readonly mountResult: MountResult) {}

  protected get page() {
    return this.mountResult.page()
  }

  protected abstract readonly name: string

  protected step = <T>(name: string, body: () => T | Promise<T>): Promise<T> => test.step(`${this.name}.${name}`, body)

  protected get = (testId: TestId) => this.mountResult.page().getByTestId(testId)

  protected press = (testId: TestId): Promise<void> => this.get(testId).click()

  protected expectToBeVisible = (testId: TestId): Promise<void> => expect(this.get(testId)).toBeVisible()

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step(`expectToastToBeShown "${message}"`, () => expect(this.mountResult.getByText(message)).toBeVisible())

  expectAudioToBePlaying = async (playing: boolean): Promise<void> =>
    this.step(`expectAudioToBePlaying ${playing}`, async () => {
      expect(await this.isAudioPlaying()).toBe(playing)
    })

  private isAudioPlaying = (): Promise<boolean> => this.page.evaluate(() => window.testHooks.isAudioPlaying)

  expectAudioPositionToBe = async (
    expectedPosition: Seconds,
    {
      exact = true,
    }: {
      exact?: boolean
    } = {},
  ): Promise<void> =>
    this.step(`expectAudioPositionToBe ${expectedPosition}s`, async () => {
      const actualPosition = await this.getAudioPosition()
      if (exact) {
        expect(actualPosition).toBe(expectedPosition)
      } else {
        expect(actualPosition).toBeCloseTo(expectedPosition)
      }
    })

  private getAudioPosition = (): Promise<Seconds> => this.page.evaluate(() => window.testHooks.audioPosition)

  expectAudioPlaybackVolumeToBe = async (expectedVolume: Volume): Promise<void> =>
    this.step(`expectAudioVolumeToBe ${expectedVolume}`, async () => {
      const actualVolume = await this.getAudioPlaybackVolume()
      expect(actualVolume).toBe(expectedVolume)
    })

  private getAudioPlaybackVolume = (): Promise<Volume> => this.page.evaluate(() => window.testHooks.audioPlaybackVolume)

  getSounds = (): Promise<Sound[]> =>
    this.step('getSounds', async () => {
      const jsonString = await this.page.evaluate(() => window.testHooks.getSoundsJson())
      return deserialiseSounds(jsonString)
    })

  wait = (duration: Duration): Promise<void> =>
    this.step(`wait ${duration.toHuman()}`, () =>
      this.page.evaluate((millis) => window.testHooks.clockTick(millis), duration.toMillis()),
    )

  protected clockNext = (): Promise<void> => this.page.evaluate(() => window.testHooks.clockNext())

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

  protected triggerDownload = async (fn: () => Promise<void>): Promise<Path> => {
    const downloadPromise = this.page.waitForEvent('download')
    await fn()
    await this.clockNext() // May be needed for the download to kick off
    const download = await downloadPromise
    const path = Path(tmp.fileSync().name)
    await download.saveAs(path)
    return path
  }
}
