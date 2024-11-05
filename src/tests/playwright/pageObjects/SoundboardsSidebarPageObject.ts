import { expect } from '@playwright/experimental-ct-react'

import { SoundboardsSidebarTestIds } from '../../../components/soundboardsEditor/sidebar/SoundboardsSidebarTestIds.ts'
import { PageObject } from './PageObject.ts'

export class SoundboardsSidebarPageObject extends PageObject {
  pressNewSoundboard = (): Promise<void> =>
    this.step('pressNewSoundboard', () => this.press(SoundboardsSidebarTestIds.newSoundboardButton))

  expectSoundboardNamesToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectSoundboardNamesToBe [${expectedNamesInOrder.join(', ')}]`, () =>
      expect(async () => {
        const soundboardNames = this.page.getByTestId(SoundboardsSidebarTestIds.soundboardName)
        const textContents = await soundboardNames.evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLElement).innerText),
        )
        expect(textContents).toEqual(expectedNamesInOrder)
      }).toPass(),
    )

  pickSoundboard = (name: string): Promise<void> =>
    this.step(`pickSoundboard ${name}`, () =>
      this.mountResult.getByTestId(SoundboardsSidebarTestIds.soundboardName).getByText(name).click(),
    )
}
