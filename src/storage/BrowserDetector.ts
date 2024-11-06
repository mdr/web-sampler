import { isChromiumBasedBrowser } from '../utils/browserUtils'

export class BrowserDetector {
  isChromiumBasedBrowser = (): boolean => isChromiumBasedBrowser()
}
