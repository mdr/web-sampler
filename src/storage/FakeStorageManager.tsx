import { AbstractStorageManager } from './AbstractStorageManager.tsx'
import { AttemptToMakeStoragePersistentResult, StorageManager } from './StorageManager.tsx'

export class FakeStorageManager extends AbstractStorageManager implements StorageManager {
  isStoragePersistent: boolean = false

  constructor(
    isStoragePersistent: boolean,
    private readonly result: AttemptToMakeStoragePersistentResult,
  ) {
    super()
    this.isStoragePersistent = isStoragePersistent
  }

  attemptToMakeStoragePersistent = (): Promise<AttemptToMakeStoragePersistentResult> => {
    if (this.result === AttemptToMakeStoragePersistentResult.SUCCESSFUL) {
      this.isStoragePersistent = true
    }
    return Promise.resolve(this.result)
  }
}
