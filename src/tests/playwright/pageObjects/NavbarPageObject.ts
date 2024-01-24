import { CapturePageObject } from './CapturePageObject.ts'
import { NavbarTestIds } from '../../../components/NavbarTestIds.ts'
import { PageObject } from './PageObject.ts'

export class NavbarPageObject extends PageObject {
  clickCapture = (): Promise<CapturePageObject> =>
    this.step('clickCapture', async () => {
      await this.clickByTestId(NavbarTestIds.capture)
      return CapturePageObject.verifyOpen(this.mountResult)
    })
}
