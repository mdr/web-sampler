import { expect, MountResult, test } from '@playwright/experimental-ct-react'
import { Path, Seconds, secondsToMillis, TestId, Volume } from '../../../utils/types/brandedTypes.ts'
import { platform } from 'node:os'
import { Option } from '../../../utils/types/Option.ts'
import { Sound } from '../../../types/Sound.ts'
import { deserialiseSounds } from '../testApp/soundsSerialisation.ts'
import tmp from 'tmp'
import { ProxyWindowTestHooks } from '../testApp/ProxyWindowTestHooks.ts'
import { Soundboard, soundboardSchema } from '../../../types/Soundboard.ts'
import { z } from 'zod'
import { Locator } from 'playwright'
import { Page } from 'playwright-core'

export abstract class PageObject {
  protected constructor(protected readonly mountResult: MountResult) {}

  protected get page(): Page {
    return this.mountResult.page()
  }

  protected abstract readonly name: string

  protected step = <T>(name: string, body: () => T | Promise<T>): Promise<T> => test.step(`${this.name}.${name}`, body)

  protected get = (testId: TestId): Locator => this.mountResult.page().getByTestId(testId)

  protected press = (testId: TestId): Promise<void> => this.get(testId).click()

  protected expectToBeVisible = (testId: TestId): Promise<void> => expect(this.get(testId)).toBeVisible()

  protected expectToBeHidden = (testId: TestId): Promise<void> => expect(this.get(testId)).toBeHidden()

  expectToastToBeShown = (message: string): Promise<void> =>
    this.step(`expectToastToBeShown "${message}"`, () => expect(this.mountResult.getByText(message)).toBeVisible())

  expectAudioToBePlaying = async (playing: boolean): Promise<void> =>
    this.step(`expectAudioToBePlaying ${playing}`, async () => {
      expect(await this.isAudioPlaying()).toBe(playing)
    })

  protected get testHooks(): ProxyWindowTestHooks {
    return new ProxyWindowTestHooks(this.mountResult)
  }

  private isAudioPlaying = (): Promise<boolean> => this.testHooks.isAudioPlaying()

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

  private getAudioPosition = (): Promise<Seconds> => this.testHooks.getAudioPosition()

  expectAudioPlaybackVolumeToBe = (expectedVolume: Volume): Promise<void> =>
    this.step(`expectAudioVolumeToBe ${expectedVolume}`, async () => {
      const actualVolume = await this.getAudioPlaybackVolume()
      expect(actualVolume).toBe(expectedVolume)
    })

  private getAudioPlaybackVolume = (): Promise<Volume> => this.testHooks.getAudioPlaybackVolume()

  getSounds = (): Promise<Sound[]> =>
    this.step('getSounds', async () => {
      const jsonString = await this.testHooks.getSoundsJson()
      return deserialiseSounds(jsonString)
    })

  getOnlySound = async (): Promise<Sound> => {
    const sounds = await this.getSounds()
    if (sounds.length !== 1) {
      throw new Error(`Expected exactly one sound, but got ${sounds.length}`)
    }
    return sounds[0]
  }

  getSoundboards = (): Promise<Soundboard[]> =>
    this.step('getSoundboards', async () => {
      const jsonString = await this.testHooks.getSoundboardsJson()
      return z.array(soundboardSchema).parse(jsonString)
    })

  wait = (duration: Seconds): Promise<void> =>
    this.step(`wait ${duration}s`, () => this.testHooks.clockTick(secondsToMillis(duration)))

  protected clockNext = (): Promise<void> => this.testHooks.clockNext()

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

  navigateBack = (): Promise<void> =>
    this.step('navigateBack', async () => {
      await this.page.goBack()
    })
}
