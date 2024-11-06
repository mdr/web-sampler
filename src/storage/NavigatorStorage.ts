export class NavigatorStorage {
  isStoragePersistent = (): Promise<boolean> => navigator.storage.persisted()
  attemptToMakeStoragePersistent = (): Promise<boolean> => navigator.storage.persist()
}
