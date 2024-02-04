import { NavbarPageObject } from './NavbarPageObject.ts'
import { PageObject } from './PageObject.ts'
import { EditSoundPageObject } from './EditSoundPageObject.ts'
import { HomePageTestIds } from '../../../components/HomePage.testIds.ts'

export class HomePageObject extends PageObject {
  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }

  clickNewSoundButton = async (): Promise<EditSoundPageObject> =>
    this.step('clickNewSoundButton', async () => {
      await this.click(HomePageTestIds.newSoundButton)
      return EditSoundPageObject.verifyOpen(this.mountResult)
    })
}
