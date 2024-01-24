import { NavbarPageObject } from './NavbarPageObject.ts'
import { PageObject } from './PageObject.ts'

export class HomePageObject extends PageObject {
  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }
}
