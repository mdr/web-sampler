import { EditSoundPaneTestIds } from '../../../components/soundsEditor/editSoundPane/EditSoundPaneTestIds.ts'
import { PageObject } from './PageObject.ts'
import { ShortcutsDialogPageObject } from './ShortcutsDialogPageObject.ts'

export class SoundsEditorKeyboardShortcutsPageObject extends PageObject {
  togglePlayPause = (): Promise<void> => this.step('togglePlayPause', () => this.page.keyboard.press('Space'))

  undo = (): Promise<void> =>
    this.step('undo', async () => this.page.keyboard.press((await this.isMacBrowser()) ? 'Meta+KeyZ' : 'Control+KeyZ'))

  redo = (): Promise<void> =>
    this.step('redo', async () =>
      this.page.keyboard.press((await this.isMacBrowser()) ? 'Meta+Shift+KeyZ' : 'Control+KeyY'),
    )

  // Shortcuts follow the platform reported by the browser's user agent, which Playwright's device emulation
  // may set independently of the host OS
  private isMacBrowser = (): Promise<boolean> => this.page.evaluate(() => /mac/i.test(navigator.userAgent))

  showShortcuts = (): Promise<ShortcutsDialogPageObject> =>
    this.step('showShortcuts', async () => {
      // The hotkey is registered by the Shortcuts button, so wait for it to be rendered
      await this.expectToBeVisible(EditSoundPaneTestIds.shortcutsButton)
      await this.page.keyboard.press('Shift+Slash')
      return new ShortcutsDialogPageObject(this.mountResult).verifyIsShown()
    })

  seekRight = (): Promise<void> =>
    this.step('seekRight', async () => {
      await this.page.keyboard.press('ArrowRight')
      await this.shortWait()
    })

  seekRightFine = (): Promise<void> =>
    this.step('seekRightFine', async () => {
      await this.page.keyboard.press('Shift+ArrowRight')
      await this.shortWait()
    })

  seekLeftFine = (): Promise<void> =>
    this.step('seekLeftFine', async () => {
      await this.page.keyboard.press('Shift+ArrowLeft')
      await this.shortWait()
    })

  seekLeft = (): Promise<void> =>
    this.step('seekLeft', async () => {
      await this.page.keyboard.press('ArrowLeft')
      await this.shortWait()
    })

  setStartPosition = (): Promise<void> =>
    this.step('setStartPosition', async () => {
      await this.page.keyboard.press('s')
      await this.shortWait()
    })

  setFinishPosition = (): Promise<void> =>
    this.step('setFinishPosition', async () => {
      await this.page.keyboard.press('f')
      await this.shortWait()
    })
}
