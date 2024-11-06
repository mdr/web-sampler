import { isChromiumBasedBrowser } from '../utils/browserUtils.ts'
import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.tsx'

export interface StorageManagerState {
  readonly isStoragePersistent: boolean
}

export interface StorageManagerActions {
  attemptToMakeStoragePersistent(): Promise<AttemptToMakeStoragePersistentResult>
  checkIfStorageIsPersistent(): Promise<void>
}

export class StorageManager extends AbstractService<StorageManagerState> implements StorageManagerActions {
  constructor() {
    super({ isStoragePersistent: false })
  }

  checkIfStorageIsPersistent = async (): Promise<void> =>
    this.setState({ isStoragePersistent: await navigator.storage.persisted() })

  private requestNotificationPermission = async (): Promise<boolean> =>
    (await Notification.requestPermission()) === 'granted'

  attemptToMakeStoragePersistent = async (): Promise<AttemptToMakeStoragePersistentResult> => {
    // On Chromium-based browsers, the most reliable way to make storage persistent is to request
    // notification permission:
    if (isChromiumBasedBrowser() && (await this.requestNotificationPermission())) {
      return AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED
    }
    const isStoragePersistent = await navigator.storage.persist()
    this.setState({ isStoragePersistent })
    return isStoragePersistent
      ? AttemptToMakeStoragePersistentResult.SUCCESSFUL
      : AttemptToMakeStoragePersistentResult.UNSUCCESSFUL
  }
}
