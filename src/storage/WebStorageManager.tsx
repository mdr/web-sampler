import { isChromiumBasedBrowser } from '../utils/browserUtils.ts'
import { AbstractStorageManager } from './AbstractStorageManager.tsx'
import { AttemptToMakeStoragePersistentResult, StorageManager } from './StorageManager.tsx'

export class WebStorageManager extends AbstractStorageManager implements StorageManager {
  checkIfStorageIsPersistent = async (): Promise<void> => {
    const isStoragePersistent = await navigator.storage.persisted()
    this.setIsStoragePersistent(isStoragePersistent)
  }

  attemptToMakeStoragePersistent = async (): Promise<AttemptToMakeStoragePersistentResult> => {
    // On Chromium-based browsers, the most reliable way to make storage persistent is to request
    // notification permission:
    if (isChromiumBasedBrowser()) {
      const notificationPermission = await Notification.requestPermission()
      if (notificationPermission !== 'granted') {
        return AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED
      }
    }
    const isStoragePersistent = await navigator.storage.persist()
    this.setIsStoragePersistent(isStoragePersistent)
    return isStoragePersistent
      ? AttemptToMakeStoragePersistentResult.SUCCESSFUL
      : AttemptToMakeStoragePersistentResult.UNSUCCESSFUL
  }
}
