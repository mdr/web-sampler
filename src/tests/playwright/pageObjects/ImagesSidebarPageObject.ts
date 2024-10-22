import { expect } from '@playwright/experimental-ct-react'

import { ImagesSidebarTestIds } from '../../../components/images/sidebar/ImagesSidebarTestIds.ts'
import { PageObject } from './PageObject.ts'

export class ImagesSidebarPageObject extends PageObject {
  protected readonly name = 'ImagesSidebar'

  pressNewImage = (): Promise<void> => this.step('pressNewImage', () => this.press(ImagesSidebarTestIds.newImageButton))

  expectImageNamesToBe = (expectedNamesInOrder: string[]) =>
    this.step(`expectImageNamesToBe [${expectedNamesInOrder.join(', ')}]`, () =>
      expect(async () => {
        const imageNames = this.page.getByTestId(ImagesSidebarTestIds.imageName)
        const textContents = await imageNames.evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLElement).innerText),
        )
        expect(textContents).toEqual(expectedNamesInOrder)
      }).toPass(),
    )

  pickImage = (name: string): Promise<void> =>
    this.step(`pickImage ${name}`, () =>
      this.mountResult.getByTestId(ImagesSidebarTestIds.sidebar).getByText(name).click(),
    )
}
