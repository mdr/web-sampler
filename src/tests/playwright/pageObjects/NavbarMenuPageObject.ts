import { PageObject } from './PageObject.ts'
import { NavbarTestIds } from '../../../components/soundsEditor/navbar/NavbarTestIds.ts'
import tmp from 'tmp'

export class NavbarMenuPageObject extends PageObject {
  protected readonly name = 'NavbarMenu'

  pressExportAllSounds = (): Promise<string> =>
    this.step('pressExportAllSounds', async () => {
      const downloadPromise = this.page.waitForEvent('download')
      await this.press(NavbarTestIds.exportAllSoundsMenuItem)
      await this.clockNext() // Needed for the download to kick off
      const download = await downloadPromise
      const file = tmp.fileSync({ prefix: 'library', postfix: '.sounds' }).name
      await download.saveAs(file)
      return file
    })

  pressImportSounds = (path: string): Promise<void> =>
    this.step('pressImportSounds', async () => {
      const fileChooserPromise = this.page.waitForEvent('filechooser')
      await this.press(NavbarTestIds.importSoundsMenuItem)
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(path)
    })
}
