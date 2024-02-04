import { EditSoundPageObject } from './EditSoundPageObject.ts'
import { NavbarTestIds } from '../../../components/Navbar.testIds.ts'
import { PageObject } from './PageObject.ts'

export class NavbarPageObject extends PageObject {
  clickCapture = (): Promise<EditSoundPageObject> =>
    this.step('clickCapture', async () => {
      await this.click(NavbarTestIds.capture)
      return EditSoundPageObject.verifyOpen(this.mountResult)
    })
}
