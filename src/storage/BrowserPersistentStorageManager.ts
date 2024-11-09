import { PersistentStorageManager } from './PersistentStorageManager.ts'

export class BrowserPersistentStorageManager implements PersistentStorageManager {
  isStoragePersistent = (): Promise<boolean> => navigator.storage.persisted()
  attemptToMakeStoragePersistent = (): Promise<boolean> => navigator.storage.persist()
}
