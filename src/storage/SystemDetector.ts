import { isChromiumBasedBrowser } from '../utils/browserUtils'

export interface SystemDetector {
  isChromiumBasedBrowser(): boolean
}

export class BowserSystemDetector implements SystemDetector {
  isChromiumBasedBrowser = (): boolean => isChromiumBasedBrowser()
}
