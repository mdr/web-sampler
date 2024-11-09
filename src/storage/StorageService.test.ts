import { describe, expect, test, vi } from 'vitest'

import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { PermissionManager } from './PermissionManager.ts'
import { PersistentStorageManager } from './PersistentStorageManager.ts'
import { StorageService } from './StorageService.ts'
import { SystemDetector } from './SystemDetector.ts'

class MockPersistentStorageManager implements PersistentStorageManager {
  constructor(private readonly isStorageInitiallyPersistent: boolean = false) {}
  isStoragePersistent = () => Promise.resolve(this.isStorageInitiallyPersistent)

  attemptToMakeStoragePersistent = vi.fn(() => Promise.resolve(true))
}

class MockPermissionManager implements PermissionManager {
  requestNotificationPermission = vi.fn(() => Promise.resolve(true))
}

class MockSystemDetector implements SystemDetector {
  isChromiumBasedBrowser = () => true
}

const makeStorageService = ({ isStorageInitiallyPersistent }: { isStorageInitiallyPersistent: boolean }) => {
  const persistentStorageManager = new MockPersistentStorageManager(isStorageInitiallyPersistent)
  const permissionManager = new MockPermissionManager()
  const systemDetector = new MockSystemDetector()
  const storageService = new StorageService(persistentStorageManager, permissionManager, systemDetector)
  return { storageService, persistentStorageManager, permissionManager, systemDetector }
}

describe('attemptToMakeStoragePersistent', () => {
  test('if storage is already persistent, return SUCCESSFUL taking no action', async () => {
    const { storageService, permissionManager, persistentStorageManager } = makeStorageService({
      isStorageInitiallyPersistent: true,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.SUCCESSFUL)
    expect(storageService.state.isStoragePersistent).toBe(true)
    expect(persistentStorageManager.attemptToMakeStoragePersistent).not.toHaveBeenCalled()
    expect(permissionManager.requestNotificationPermission).not.toHaveBeenCalled()
  })
})
