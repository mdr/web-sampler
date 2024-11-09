import { SystemDetector } from './SystemDetector.ts'

export class MockSystemDetectorTestSupport implements SystemDetector {
  constructor(private readonly _isChromiumBasedBrowser: boolean) {}

  isChromiumBasedBrowser = () => this._isChromiumBasedBrowser
}
