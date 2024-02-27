import { PageObject } from './PageObject.ts'
import { expect } from '@playwright/experimental-ct-react'
import { SoundSidebarTestIds } from '../../../components/soundsEditorPage/SoundEditorPageTestIds.ts'

export class SoundSidebarPageObject extends PageObject {
  protected readonly name = 'SoundSidebar'

  pressNewSound = (): Promise<void> => this.step('pressNewSound', () => this.press(SoundSidebarTestIds.newSoundButton))

  expectSoundNamesToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectSoundNamesToBe [${expectedNamesInOrder.join(', ')}]`, async () => {
      const soundNames = this.page.getByTestId(SoundSidebarTestIds.soundName)
      const textContents = await soundNames.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).innerText))
      expect(textContents).toEqual(expectedNamesInOrder)
    })

  pickSound = (name: string): Promise<void> =>
    this.step(`pickSound ${name}`, () =>
      this.mountResult.getByTestId(SoundSidebarTestIds.sidebar).getByText(name).click(),
    )
}
