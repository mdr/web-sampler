import { PersistentStorageManager } from './PersistentStorageManager.ts'

export class MockPersistentStorageManager implements PersistentStorageManager {
  private _isStoragePersistent: boolean

  constructor(
    isStorageInitiallyPersistent: boolean = false,
    private readonly grantPersistentStorage: boolean = true,
  ) {
    this._isStoragePersistent = isStorageInitiallyPersistent
  }

  isStoragePersistent = (): Promise<boolean> => Promise.resolve(this._isStoragePersistent)

  attemptToMakeStoragePersistent = (): Promise<boolean> => {
    if (this.grantPersistentStorage) {
      this._isStoragePersistent = true
    }
    return Promise.resolve(this._isStoragePersistent)
  }
}
