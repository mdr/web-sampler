import { MountResult, expect } from '@playwright/experimental-ct-react'
import { Locator } from 'playwright'

import { EditSoundboardPaneTestIds } from '../../../components/soundboardsEditor/editSoundboardPane/EditSoundboardPaneTestIds.ts'
import { SoundboardsSidebarTestIds } from '../../../components/soundboardsEditor/sidebar/SoundboardsSidebarTestIds.ts'
import { ChooseSoundDialogPageObject } from './ChooseSoundDialogPageObject.ts'
import { NavbarPageObject } from './NavbarPageObject.ts'
import { PageObject } from './PageObject.ts'
import { SoundboardsSidebarPageObject } from './SoundboardsSidebarPageObject.ts'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'

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

  pressDeleteSoundboard = (): Promise<void> =>
    this.step('pressDeleteSoundboard', () => this.get(EditSoundboardPaneTestIds.deleteButton).click())

  addSound = async (soundName: string): Promise<void> => {
    const chooseSoundDialog = await this.pressAddSound()
    await chooseSoundDialog.pressDropdownButton()
    await chooseSoundDialog.selectSoundOption(soundName)
    await chooseSoundDialog.pressAddButton()
  }

  private getSoundTile = (soundName: string): Locator =>
    this.get(EditSoundboardPaneTestIds.soundTile).filter({ hasText: soundName })

  dragSound = ({ fromSoundName, toSoundName }: { fromSoundName: string; toSoundName: string }): Promise<void> =>
    this.step(`dragSound ${fromSoundName} to ${toSoundName}`, async () => {
      const fromSound = this.getSoundTile(fromSoundName)
      const toSound = this.getSoundTile(toSoundName)
      await fromSound.dragTo(toSound)
    })

  removeSoundFromSoundboard = (soundName: string): Promise<void> =>
    this.step(`removeSoundFromSoundboard ${soundName}`, () =>
      this.getSoundTile(soundName).getByTestId(EditSoundboardPaneTestIds.removeSoundButton).click(),
    )

  editSound = (soundName: string): Promise<SoundsEditorPageObject> =>
    this.step(`editSound ${soundName}`, async () => {
      await this.getSoundTile(soundName).getByTestId(EditSoundboardPaneTestIds.editSoundButton).click()
      return await SoundsEditorPageObject.verifyIsShown(this.mountResult)
    })

  expectSoundTilesToBe = (expectedSoundNames: string[]): Promise<void> =>
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
