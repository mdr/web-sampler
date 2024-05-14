import { PageObject } from './PageObject.ts'
import { expect } from '@playwright/experimental-ct-react'
import { SoundsSidebarTestIds } from '../../../components/soundsEditor/sidebar/SoundsSidebarTestIds.ts'

export class SoundsSidebarPageObject extends PageObject {
  protected readonly name = 'SoundsSidebar'

  pressNewSound = (): Promise<void> => this.step('pressNewSound', () => this.press(SoundsSidebarTestIds.newSoundButton))

  expectSoundNamesToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectSoundNamesToBe [${expectedNamesInOrder.join(', ')}]`, () =>
      expect(async () => {
        const soundNames = this.page.getByTestId(SoundsSidebarTestIds.soundName)
        const textContents = await soundNames.evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLElement).innerText),
        )
        expect(textContents).toEqual(expectedNamesInOrder)
      }).toPass(),
    )

  pickSound = (name: string): Promise<void> =>
    this.step(`pickSound ${name}`, () =>
      this.mountResult.getByTestId(SoundsSidebarTestIds.sidebar).getByText(name).click(),
    )
}
