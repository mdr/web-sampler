import { WindowTestHooks } from '../tests/playwright/WindowTestHooks.ts'

declare global {
  interface Window {
    testHooks: WindowTestHooks
  }
}

export {}
