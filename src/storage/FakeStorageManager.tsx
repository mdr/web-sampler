import { AbstractStorageManager } from './AbstractStorageManager.tsx'
import { AttemptToMakeStoragePersistentResult, StorageManager } from './StorageManager.tsx'

export class FakeStorageManager extends AbstractStorageManager implements StorageManager {
  constructor(
    private readonly initiallyIsPersistent: boolean,
    private readonly result: AttemptToMakeStoragePersistentResult,
  ) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  checkIfStorageIsPersistent = async (): Promise<void> => {
    this.setIsStoragePersistent(this.initiallyIsPersistent)
  }

  attemptToMakeStoragePersistent = (): Promise<AttemptToMakeStoragePersistentResult> => {
    if (this.result === AttemptToMakeStoragePersistentResult.SUCCESSFUL) {
      this.setIsStoragePersistent(true)
    }
    return Promise.resolve(this.result)
  }
}
