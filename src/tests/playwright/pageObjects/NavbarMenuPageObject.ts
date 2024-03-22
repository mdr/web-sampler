import { PageObject } from './PageObject.ts'
import { NavbarTestIds } from '../../../components/navbar/NavbarTestIds.ts'
import { Path } from '../../../utils/types/brandedTypes.ts'

export class NavbarMenuPageObject extends PageObject {
  protected readonly name = 'NavbarMenu'

  pressExportAllSounds = (): Promise<Path> =>
    this.step('pressExportAllSounds', () =>
      this.triggerDownload(() => this.press(NavbarTestIds.exportAllSoundsMenuItem)),
    )

  pressImportSounds = (path: Path): Promise<void> =>
    this.step('pressImportSounds', async () => {
      const fileChooserPromise = this.page.waitForEvent('filechooser')
      await this.press(NavbarTestIds.importSoundsMenuItem)
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(path)
    })
}
