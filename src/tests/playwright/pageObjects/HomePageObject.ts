import { PageObject } from './PageObject.ts'
import { EditSoundPageObject } from './EditSoundPageObject.ts'
import { HomePageTestIds } from '../../../components/homePage/HomePage.testIds.ts'

export class HomePageObject extends PageObject {
  clickNewSound = (): Promise<EditSoundPageObject> =>
    this.step('clickNewSound', async () => {
      await this.click(HomePageTestIds.newSoundButton)
      return EditSoundPageObject.verifyIsShown(this.mountResult)
    })
}
