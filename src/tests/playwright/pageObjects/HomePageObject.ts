import { MountResult } from '../types.ts'
import { NavbarPageObject } from './NavbarPageObject.ts'

export class HomePageObject {
  constructor(private readonly mountResult: MountResult) {}

  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.mountResult)
  }
}
