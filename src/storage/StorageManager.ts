import AsyncLock from 'async-lock'

import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { BrowserDetector } from './BrowserDetector.ts'
import { NavigatorStorage } from './NavigatorStorage.ts'
import { PermissionManager } from './PermissionManager.ts'

export interface StorageManagerState {
  readonly isStoragePersistent: boolean
}

export interface StorageManagerActions {
  attemptToMakeStoragePersistent(): Promise<AttemptToMakeStoragePersistentResult>
  checkIfStorageIsPersistent(): Promise<void>
}

export class StorageManager extends AbstractService<StorageManagerState> implements StorageManagerActions {
  private readonly lock: AsyncLock = new AsyncLock()

  constructor(
    private readonly navigatorStorage: NavigatorStorage,
    private readonly permissionManager: PermissionManager,
    private readonly browserDetector: BrowserDetector,
  ) {
    super({ isStoragePersistent: false })
  }

  checkIfStorageIsPersistent = (): Promise<void> =>
    this.lock.acquire('lock', async () => {
      const isStoragePersistent = await this.navigatorStorage.isStoragePersistent()
      this.setState({ isStoragePersistent })
    })

  attemptToMakeStoragePersistent = (): Promise<AttemptToMakeStoragePersistentResult> =>
    this.lock.acquire('lock', async () => {
      // On Chromium-based browsers, the most reliable way to make storage persistent is to request
      // notification permission:
      if (this.browserDetector.isChromiumBasedBrowser()) {
        const success = await this.permissionManager.requestNotificationPermission()
        if (success) {
          return AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED
        }
      }
      const isStoragePersistent = await this.navigatorStorage.attemptToMakeStoragePersistent()
      this.setState({ isStoragePersistent })
      return isStoragePersistent
        ? AttemptToMakeStoragePersistentResult.SUCCESSFUL
        : AttemptToMakeStoragePersistentResult.UNSUCCESSFUL
    })
}
