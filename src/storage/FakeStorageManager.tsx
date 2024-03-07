import { AbstractStorageManager } from './AbstractStorageManager.tsx'
import { AttemptToMakeStoragePersistentResult, StorageManager } from './StorageManager.tsx'

export class FakeStorageManager extends AbstractStorageManager implements StorageManager {
  isStoragePersistent: boolean = false

  attemptToMakeStoragePersistent = async (): Promise<AttemptToMakeStoragePersistentResult> => {
    this.isStoragePersistent = true
    return AttemptToMakeStoragePersistentResult.SUCCESSFUL
  }
}
