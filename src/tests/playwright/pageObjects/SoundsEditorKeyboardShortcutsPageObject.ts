import { platform } from 'node:os'

import { PageObject } from './PageObject.ts'

export class SoundsEditorKeyboardShortcutsPageObject extends PageObject {
  togglePlayPause = (): Promise<void> => this.step('togglePlayPause', () => this.page.keyboard.press('Space'))

  undo = (): Promise<void> =>
    this.step('undo', () => this.page.keyboard.press(platform() === 'darwin' ? 'Meta+KeyZ' : 'Control+KeyZ'))

  redo = (): Promise<void> =>
    this.step('redo', () => this.page.keyboard.press(platform() === 'darwin' ? 'Meta+Shift+KeyZ' : 'Control+KeyY'))

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
