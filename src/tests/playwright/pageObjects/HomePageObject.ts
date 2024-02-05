import { PageObject } from './PageObject.ts'
import { SoundSidebarTestIds } from '../../../components/shared/shared.testIds.ts'
import { MountResult } from '../types.ts'
import { expect } from '@playwright/experimental-ct-react'
import { SoundSidebarPageObject } from './SoundSidebarPageObject.ts'

export class HomePageObject extends PageObject {
  static verifyIsShown = async (mountResult: MountResult): Promise<HomePageObject> => {
    await expect(mountResult.getByTestId(SoundSidebarTestIds.newSoundButton)).toBeVisible()
    return new HomePageObject(mountResult)
  }

  get sidebar() {
    return new SoundSidebarPageObject(this.mountResult)
  }
}
