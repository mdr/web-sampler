import { PageObject } from './PageObject.ts'
import { MountResult } from '../types.ts'
import { expect } from '@playwright/experimental-ct-react'
import { SoundSidebarTestIds } from '../../../components/soundsEditorPage/EditSoundPaneTestIds.ts'

export class SoundSidebarPageObject extends PageObject {
  static verifyIsShown = async (mountResult: MountResult): Promise<SoundSidebarPageObject> => {
    await expect(mountResult.getByTestId(SoundSidebarTestIds.newSoundButton)).toBeVisible()
    return new SoundSidebarPageObject(mountResult)
  }

  pressNewSound = (): Promise<void> => this.step('pressNewSound', () => this.press(SoundSidebarTestIds.newSoundButton))

  expectSoundNamesToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectSoundNamesToBe [${expectedNamesInOrder.join(', ')}]`, async () => {
      const soundNames = this.page.getByTestId(SoundSidebarTestIds.soundName)
      const textContents = await soundNames.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).innerText))
      expect(textContents).toEqual(expectedNamesInOrder)
    })
}
