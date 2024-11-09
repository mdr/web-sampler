import { isChromiumBasedBrowser } from '../utils/browserUtils'
import { SystemDetector } from './SystemDetector.ts'

export class ActualSystemDetector implements SystemDetector {
  isChromiumBasedBrowser = (): boolean => isChromiumBasedBrowser()
}
