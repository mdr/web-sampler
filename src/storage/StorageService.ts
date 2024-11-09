import AsyncLock from 'async-lock'

import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { PermissionManager } from './PermissionManager.ts'
import { PersistentStorageManager } from './PersistentStorageManager.ts'
import { SystemDetector } from './SystemDetector.ts'

export interface StorageState {
  readonly isStoragePersistent: boolean
}

export interface StorageActions {
  attemptToMakeStoragePersistent(): Promise<AttemptToMakeStoragePersistentResult>
  checkIfStorageIsPersistent(): Promise<void>
}

export class StorageService extends AbstractService<StorageState> implements StorageActions {
  private readonly lock: AsyncLock = new AsyncLock()

  constructor(
    private readonly persistentStorageManager: PersistentStorageManager,
    private readonly permissionManager: PermissionManager,
    private readonly systemDetector: SystemDetector,
  ) {
    super({ isStoragePersistent: false })
  }

  checkIfStorageIsPersistent = (): Promise<void> =>
    this.lock.acquire('lock', async () => {
      const isStoragePersistent = await this.persistentStorageManager.isStoragePersistent()
      this.setState({ isStoragePersistent })
    })

  attemptToMakeStoragePersistent = (): Promise<AttemptToMakeStoragePersistentResult> =>
    this.lock.acquire('lock', async () => {
      if (await this.persistentStorageManager.isStoragePersistent()) {
        this.setState({ isStoragePersistent: true })
        return AttemptToMakeStoragePersistentResult.SUCCESSFUL
      }
      // On Chromium-based browsers, the most reliable way to make storage persistent is to request
      // notification permission:
      if (this.systemDetector.isChromiumBasedBrowser()) {
        const success = await this.permissionManager.requestNotificationPermission()
        if (success) {
          return AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED
        }
      }
      const isStoragePersistent = await this.persistentStorageManager.attemptToMakeStoragePersistent()
      this.setState({ isStoragePersistent })
      return isStoragePersistent
        ? AttemptToMakeStoragePersistentResult.SUCCESSFUL
        : AttemptToMakeStoragePersistentResult.UNSUCCESSFUL
    })
}
