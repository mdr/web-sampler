import { MountResult, expect, test } from '@playwright/experimental-ct-react'
import { platform } from 'node:os'
import { Locator } from 'playwright'
import { Page } from 'playwright-core'
import tmp from 'tmp'
import { z } from 'zod'

import { Sound } from '../../../types/Sound.ts'
import { Soundboard, soundboardSchema } from '../../../types/Soundboard.ts'
import { Path, Seconds, TestId, Volume, secondsToMillis } from '../../../utils/types/brandedTypes.ts'
import { ProxyWindowTestHooks } from '../testApp/ProxyWindowTestHooks.ts'
import { deserialiseSounds } from '../testApp/soundsSerialisation.ts'

export abstract class PageObject {
  protected readonly name: string

  constructor(protected readonly mountResult: MountResult) {
    const constructorName = this.constructor.name
    if (!constructorName.endsWith('PageObject')) {
      throw new Error(`A Page Object name must end with 'PageObject', but was '${constructorName}'`)
    }
    this.name = constructorName.replace('PageObject', '')
  }

  protected get page(): Page {
    return this.mountResult.page()
  }

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
    this.step(`wait ${duration}s`, () => this.page.clock.fastForward(secondsToMillis(duration)))

  protected shortWait = (): Promise<void> => this.page.clock.runFor(50)

  checkScreenshot = async (
    name: string,
    { testIdToCapture, elementsToMask }: ScreenshotOptions = {},
  ): Promise<void> => {
    if (platform() !== 'linux') {
      return
    }
    const locator = testIdToCapture === undefined ? this.mountResult : this.get(testIdToCapture)
    await expect(locator).toHaveScreenshot(`${name}.png`, { mask: elementsToMask })
  }

  protected clickAndUploadFile = async (testId: TestId, path: Path): Promise<void> => {
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await this.press(testId)
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(path)
  }

  protected triggerDownload = async (fn: () => Promise<void>): Promise<Path> => {
    const downloadPromise = this.page.waitForEvent('download')
    await fn()
    await this.shortWait() // May be needed for the download to kick off
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

export interface ScreenshotOptions {
  testIdToCapture?: TestId
  elementsToMask?: Locator[]
}
