import AsyncLock from 'async-lock'

import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { PermissionManager } from './PermissionManager.ts'
import { PersistentStorageManager } from './PersistentStorageManager.ts'
import { SystemDetector } from './SystemDetector.ts'
import { ToastManager } from './ToastManager.ts'

export interface StorageState {
  readonly isStoragePersistent: boolean
}

export interface StorageActions {
  attemptToMakeStoragePersistent(): Promise<void>
  checkIfStorageIsPersistent(): Promise<void>
}

export const StorageServiceToastMessages = {
  SUCCESS: 'Storage is now persistent. Your recordings are safe in local storage.',
  NOTIFICATION_PERMISSION_DENIED: 'Grant notification permission to make storage persistent.',
  UNSUCCESSFUL: 'Unable to make storage persistent.',
}

export class StorageService extends AbstractService<StorageState> implements StorageActions {
  private readonly lock: AsyncLock = new AsyncLock()

  constructor(
    private readonly persistentStorageManager: PersistentStorageManager,
    private readonly permissionManager: PermissionManager,
    private readonly systemDetector: SystemDetector,
    private readonly toastManager: ToastManager,
  ) {
    super({ isStoragePersistent: false })
  }

  checkIfStorageIsPersistent = (): Promise<void> =>
    this.lock.acquire('lock', async () => {
      const isStoragePersistent = await this.persistentStorageManager.isStoragePersistent()
      this.setState({ isStoragePersistent })
    })

  attemptToMakeStoragePersistent = (): Promise<void> =>
    this.lock.acquire('lock', async () => {
      const isAlreadyPersistent = await this.persistentStorageManager.isStoragePersistent()
      if (isAlreadyPersistent) {
        this.setState({ isStoragePersistent: true })
        this.toastManager.info(StorageServiceToastMessages.SUCCESS)
        return
      }
      // On Chromium-based browsers, the most reliable way to make storage persistent is to request
      // notification permission:
      if (this.systemDetector.isChromiumBasedBrowser()) {
        const success = await this.permissionManager.requestNotificationPermission()
        if (!success) {
          this.toastManager.error(StorageServiceToastMessages.NOTIFICATION_PERMISSION_DENIED)
          return
        }
      }
      const isStoragePersistent = await this.persistentStorageManager.attemptToMakeStoragePersistent()
      this.setState({ isStoragePersistent })
      if (isStoragePersistent) {
        this.toastManager.info(StorageServiceToastMessages.SUCCESS)
      } else {
        this.toastManager.error(StorageServiceToastMessages.UNSUCCESSFUL)
      }
    })
}
