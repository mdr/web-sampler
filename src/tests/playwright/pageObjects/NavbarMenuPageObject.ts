import { NavbarTestIds } from '../../../components/navbar/NavbarTestIds.ts'
import { Path } from '../../../utils/types/brandedTypes.ts'
import { PageObject } from './PageObject.ts'

export class NavbarMenuPageObject extends PageObject {
  protected readonly name = 'NavbarMenu'

  pressExportAllSounds = (): Promise<Path> =>
    this.step('pressExportAllSounds', () =>
      this.triggerDownload(async () => {
        await this.press(NavbarTestIds.exportAllSoundsMenuItem)
        // check needed to make sure download has occurred:
        await this.expectToastToBeShown('All sounds exported.')
      }),
    )

  pressImportSounds = (path: Path): Promise<void> =>
    this.step('pressImportSounds', async () => {
      const fileChooserPromise = this.page.waitForEvent('filechooser')
      await this.press(NavbarTestIds.importSoundsMenuItem)
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(path)
    })
}
