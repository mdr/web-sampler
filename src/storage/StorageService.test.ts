import { describe, expect, it, test, vi } from 'vitest'

import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { PermissionManager } from './PermissionManager.ts'
import { PersistentStorageManager } from './PersistentStorageManager.ts'
import { StorageService } from './StorageService.ts'
import { SystemDetector } from './SystemDetector.ts'

class MockPersistentStorageManager implements PersistentStorageManager {
  private _isStoragePersistent: boolean

  constructor(
    isStorageInitiallyPersistent: boolean = false,
    private readonly grantPersistentStorage: boolean = true,
  ) {
    this._isStoragePersistent = isStorageInitiallyPersistent
  }

  isStoragePersistent = () => Promise.resolve(this._isStoragePersistent)

  attemptToMakeStoragePersistent = vi.fn(() => {
    if (this.grantPersistentStorage) {
      this._isStoragePersistent = true
    }
    return Promise.resolve(this._isStoragePersistent)
  })
}

class MockPermissionManager implements PermissionManager {
  constructor(private readonly grantNotificationPermission: boolean = true) {}

  requestNotificationPermission = vi.fn(() => Promise.resolve(this.grantNotificationPermission))
}

class MockSystemDetector implements SystemDetector {
  constructor(private readonly _isChromiumBasedBrowser: boolean) {}

  isChromiumBasedBrowser = () => this._isChromiumBasedBrowser
}

const makeStorageService = ({
  isStorageInitiallyPersistent = false,
  isChromiumBasedBrowser = false,
  grantNotificationPermission = false,
  grantPersistentStorage = false,
}: {
  isStorageInitiallyPersistent?: boolean
  isChromiumBasedBrowser?: boolean
  grantNotificationPermission?: boolean
  grantPersistentStorage?: boolean
}) => {
  const persistentStorageManager = new MockPersistentStorageManager(
    isStorageInitiallyPersistent,
    grantPersistentStorage,
  )
  const permissionManager = new MockPermissionManager(grantNotificationPermission)
  const systemDetector = new MockSystemDetector(isChromiumBasedBrowser)
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

  it('should attempt to request persistent storage, and return SUCCESSFUL if it succeeds', async () => {
    const { storageService, persistentStorageManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      grantPersistentStorage: true,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.SUCCESSFUL)
    expect(storageService.state.isStoragePersistent).toBe(true)
    expect(persistentStorageManager.attemptToMakeStoragePersistent).toHaveBeenCalled()
  })

  it('should return UNSUCCESSFUL if persistent storage is not granted', async () => {
    const { storageService } = makeStorageService({
      isStorageInitiallyPersistent: false,
      grantPersistentStorage: false,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.UNSUCCESSFUL)
    expect(storageService.state.isStoragePersistent).toBe(false)
  })

  it('should first attempt to request notification permission when on a Chromium-based browser', async () => {
    const { storageService, permissionManager, persistentStorageManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      isChromiumBasedBrowser: true,
      grantNotificationPermission: true,
      grantPersistentStorage: true,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.SUCCESSFUL)
    expect(storageService.state.isStoragePersistent).toBe(true)
    expect(permissionManager.requestNotificationPermission).toHaveBeenCalled()
    expect(persistentStorageManager.attemptToMakeStoragePersistent).toHaveBeenCalled()
  })

  it('should return NOTIFICATION_PERMISSION_DENIED if notification permission is not granted', async () => {
    const { storageService, permissionManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      isChromiumBasedBrowser: true,
      grantNotificationPermission: false,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED)
    expect(storageService.state.isStoragePersistent).toBe(false)
    expect(permissionManager.requestNotificationPermission).toHaveBeenCalled()
  })
})
