import { ToastManager } from './ToastManager.ts'

export class FakeToastManager implements ToastManager {
  info = () => undefined
  error = () => undefined
}
