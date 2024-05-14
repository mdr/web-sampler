import { PageObject } from './PageObject.ts'
import { SoundboardsSidebarTestIds } from '../../../components/soundboardsEditor/sidebar/SoundboardsSidebarTestIds.ts'

export class SoundboardsSidebarPageObject extends PageObject {
  protected readonly name = 'SoundboardsSidebar'

  pressNewSoundboard = (): Promise<void> =>
    this.step('pressNewSoundboard', () => this.press(SoundboardsSidebarTestIds.newSoundboardButton))
  //
  // expectSoundNamesToBe = (expectedNamesInOrder: string[]) =>
  //   this.step(`expectSoundNamesToBe [${expectedNamesInOrder.join(', ')}]`, () =>
  //     expect(async () => {
  //       const soundNames = this.page.getByTestId(SoundSidebarTestIds.soundName)
  //       const textContents = await soundNames.evaluateAll((nodes) =>
  //         nodes.map((node) => (node as HTMLElement).innerText),
  //       )
  //       expect(textContents).toEqual(expectedNamesInOrder)
  //     }).toPass(),
  //   )
  //
  // pickSound = (name: string): Promise<void> =>
  //   this.step(`pickSound ${name}`, () =>
  //     this.mountResult.getByTestId(SoundSidebarTestIds.sidebar).getByText(name).click(),
  //   )
}
