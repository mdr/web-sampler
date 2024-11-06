import { AbstractService } from '../utils/providerish/AbstractService.ts'
import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { StorageManagerActions, StorageManagerState } from './StorageManager.ts'

export class FakeStorageManager extends AbstractService<StorageManagerState> implements StorageManagerActions {
  constructor(
    private readonly initiallyIsPersistent: boolean,
    private readonly result: AttemptToMakeStoragePersistentResult,
  ) {
    super({ isStoragePersistent: initiallyIsPersistent })
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  checkIfStorageIsPersistent = async (): Promise<void> => {
    this.setState({ isStoragePersistent: this.initiallyIsPersistent })
  }

  attemptToMakeStoragePersistent = (): Promise<AttemptToMakeStoragePersistentResult> => {
    if (this.result === AttemptToMakeStoragePersistentResult.SUCCESSFUL) {
      this.setState({ isStoragePersistent: true })
    }
    return Promise.resolve(this.result)
  }
}
