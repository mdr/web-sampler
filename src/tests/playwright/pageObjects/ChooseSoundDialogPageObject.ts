import { PageObject } from './PageObject.ts'
import { expect, MountResult } from '@playwright/experimental-ct-react'
import { EditSoundboardPaneTestIds } from '../../../components/soundboardsEditor/editSoundboardPane/EditSoundboardPaneTestIds.ts'

export class ChooseSoundDialogPageObject extends PageObject {
  protected readonly name = 'ChooseSoundDialog'

  static verifyIsShown = async (mountResult: MountResult): Promise<ChooseSoundDialogPageObject> => {
    await expect(mountResult.page().getByTestId(EditSoundboardPaneTestIds.chooseSoundDialog)).toBeVisible()
    return new ChooseSoundDialogPageObject(mountResult)
  }

  pickSound = (name: string): Promise<void> =>
    this.step(`pickSound ${name}`, async () => {
      await this.press(EditSoundboardPaneTestIds.soundComboBoxDropdownButton)
    })
}
