export interface PersistentStorageManager {
  isStoragePersistent(): Promise<boolean>

  attemptToMakeStoragePersistent(): Promise<boolean>
}
