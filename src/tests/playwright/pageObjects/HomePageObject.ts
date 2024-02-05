import { PageObject } from './PageObject.ts'
import { EditSoundPageObject } from './EditSoundPageObject.ts'
import { SoundSidebarTestIds } from '../../../components/shared/shared.testIds.ts'
import { MountResult } from '../types.ts'
import { expect } from '@playwright/experimental-ct-react'

export class HomePageObject extends PageObject {
  static verifyIsShown = async (mountResult: MountResult): Promise<HomePageObject> => {
    await expect(mountResult.getByTestId(SoundSidebarTestIds.newSoundButton)).toBeVisible()
    return new HomePageObject(mountResult)
  }

  pressNewSound = (): Promise<EditSoundPageObject> =>
    this.step('pressNewSound', async () => {
      await this.press(SoundSidebarTestIds.newSoundButton)
      return EditSoundPageObject.verifyIsShown(this.mountResult)
    })
}
