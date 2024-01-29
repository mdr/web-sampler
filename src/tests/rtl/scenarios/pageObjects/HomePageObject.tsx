import { PageObject } from './PageObject.tsx'
import { NavbarPageObject } from './NavbarPageObject.tsx'

export class HomePageObject extends PageObject {
  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.testContext)
  }
}