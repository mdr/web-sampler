import { MountResult } from '../types.ts'
import { Navbar } from './Navbar.ts'

export class HomePage {
  constructor(private readonly mountResult: MountResult) {}

  get navbar(): Navbar {
    return new Navbar(this.mountResult)
  }
}
