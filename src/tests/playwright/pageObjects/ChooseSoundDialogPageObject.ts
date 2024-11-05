import { expect } from '@playwright/experimental-ct-react'

import { ChooseSoundDialogTestIds } from '../../../components/soundboardsEditor/editSoundboardPane/EditSoundboardPaneTestIds.ts'
import { PageObject } from './PageObject.ts'

export class ChooseSoundDialogPageObject extends PageObject {
  verifyIsShown = async (): Promise<ChooseSoundDialogPageObject> =>
    this.step('verifyIsShown', async () => {
      await expect(this.page.getByTestId(ChooseSoundDialogTestIds.dialog)).toBeVisible()
      return this
    })

  pressDropdownButton = (): Promise<void> =>
    this.step('pressDropdownButton', () => this.press(ChooseSoundDialogTestIds.comboBoxDropdownButton))

  selectSoundOption = (name: string): Promise<void> =>
    this.step(`selectSoundOption ${name}`, async () => {
      await this.get(ChooseSoundDialogTestIds.comboBoxItems).getByText(name).click()
    })

  pressAddButton = (): Promise<void> =>
    this.step('pressAddButton', () => this.press(ChooseSoundDialogTestIds.addButton))

  expectSoundOptionsToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectSoundOptionsToBe [${expectedNamesInOrder.join(', ')}]`, () =>
      expect(async () => {
        const soundNames = this.page.getByTestId(ChooseSoundDialogTestIds.soundOption)
        const textContents = await soundNames.evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLElement).innerText),
        )
        expect(textContents).toEqual(expectedNamesInOrder)
      }).toPass(),
    )
}
