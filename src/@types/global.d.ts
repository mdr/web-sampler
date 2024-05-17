import { WindowTestHooks } from '../tests/playwright/testApp/WindowTestHooks.ts'
import { Option } from '../utils/types/Option.ts'

declare global {
  interface Window {
    testHooks: Option<WindowTestHooks>
  }
}

export {}
