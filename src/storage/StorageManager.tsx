export interface StorageManagerState {
  readonly isStoragePersistent: boolean
}

export enum AttemptToMakeStoragePersistentResult {
  SUCCESSFUL = 'SUCCESSFUL',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
  NOTIFICATION_PERMISSION_DENIED = 'NOTIFICATION_PERMISSION_DENIED',
}

export interface StorageManagerActions {
  attemptToMakeStoragePersistent(): Promise<AttemptToMakeStoragePersistentResult>
}

export interface StorageManager extends StorageManagerState, StorageManagerActions {
  addListener(listener: () => void): void

  removeListener(listener: () => void): void
}
