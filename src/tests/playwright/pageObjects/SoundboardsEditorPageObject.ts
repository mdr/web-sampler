import { expect, MountResult } from '@playwright/experimental-ct-react'
import { PageObject } from './PageObject.ts'
import { NavbarPageObject } from './NavbarPageObject.ts'
import { SoundboardsSidebarTestIds } from '../../../components/soundboardsEditor/sidebar/SoundboardsSidebarTestIds.ts'
import { SoundboardsSidebarPageObject } from './SoundboardsSidebarPageObject.ts'
import { EditSoundboardPaneTestIds } from '../../../components/soundboardsEditor/editSoundboardPane/EditSoundboardPaneTestIds.ts'
import { ChooseSoundDialogPageObject } from './ChooseSoundDialogPageObject.ts'

export class SoundboardsEditorPageObject extends PageObject {
  protected readonly name = 'SoundboardsEditor'

  static verifyIsShown = async (mountResult: MountResult): Promise<SoundboardsEditorPageObject> => {
    await expect(mountResult.getByTestId(SoundboardsSidebarTestIds.sidebar)).toBeVisible()
    return new SoundboardsEditorPageObject(mountResult)
  }

  get sidebar(): SoundboardsSidebarPageObject {
    return new SoundboardsSidebarPageObject(this.mountResult)
  }

  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }

  enterSoundboardName = (name: string): Promise<void> =>
    this.step(`enterSoundboardName ${name}`, async () => {
      await this.get(EditSoundboardPaneTestIds.soundboardNameInput).click()
      await this.get(EditSoundboardPaneTestIds.soundboardNameInput).fill(name)
      await this.page.keyboard.press('Enter')
    })

  pressAddSound = (): Promise<ChooseSoundDialogPageObject> =>
    this.step('pressAddSound', async () => {
      await this.get(EditSoundboardPaneTestIds.addSoundButton).click()
      return await ChooseSoundDialogPageObject.verifyIsShown(this.mountResult)
    })

  dragSound = async ({ fromSoundName, toSoundName }: { fromSoundName: string; toSoundName: string }): Promise<void> =>
    this.step(`dragSound ${fromSoundName} to ${toSoundName}`, async () => {
      const fromSound = this.get(EditSoundboardPaneTestIds.soundTile).locator('text=' + fromSoundName)
      const toSound = this.get(EditSoundboardPaneTestIds.soundTile).locator('text=' + toSoundName)
      await fromSound.dragTo(toSound)
    })

  expectSoundTilesToBe = async (expectedSoundNames: string[]): Promise<void> =>
    this.step(`expectSoundTilesToBe ${expectedSoundNames.join(', ')}`, async () =>
      expect(async () => {
        const soundTiles = this.page.getByTestId(EditSoundboardPaneTestIds.soundTile)
        const textContents = await soundTiles.evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLElement).innerText),
        )
        expect(textContents).toEqual(expectedSoundNames)
      }).toPass(),
    )
}
