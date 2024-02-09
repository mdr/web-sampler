import { WindowTestHooks } from '../tests/playwright/testApp/WindowTestHooks.ts'

declare global {
  interface Window {
    testHooks: WindowTestHooks
  }
}

export {}
