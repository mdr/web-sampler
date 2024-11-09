import { describe, expect, it, test, vi } from 'vitest'

import { AttemptToMakeStoragePersistentResult } from './AttemptToMakeStoragePersistentResult.ts'
import { MockPermissionManager } from './MockPermissionManager.testSupport.ts'
import { MockPersistentStorageManager } from './MockPersistentStorageManager.testSupport.ts'
import { MockSystemDetectorTestSupport } from './MockSystemDetector.testSupport.ts'
import { StorageService } from './StorageService.ts'

describe('checkIfStorageIsPersistent', () => {
  it('should should update isStoragePersistent state if storage is persistent', async () => {
    const { storageService } = makeStorageService({ isStorageInitiallyPersistent: true })
    expect(storageService.state.isStoragePersistent).toBe(false)

    await storageService.checkIfStorageIsPersistent()

    expect(storageService.state.isStoragePersistent).toBe(true)
  })

  it('should notify listeners when isStoragePersistent state changes', async () => {
    const { storageService } = makeStorageService({ isStorageInitiallyPersistent: false })
    const listener = vi.fn()
    storageService.addListener(listener)

    await storageService.checkIfStorageIsPersistent()

    expect(listener).toHaveBeenCalled()
  })
})

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

  it('should fire listeners when isStoragePersistent state changes', async () => {
    const { storageService } = makeStorageService({ isStorageInitiallyPersistent: false, grantPersistentStorage: true })
    const listener = vi.fn()
    storageService.addListener(listener)

    await storageService.attemptToMakeStoragePersistent()

    expect(listener).toHaveBeenCalled()
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
    expect(permissionManager.notificationPermissionGranted).toBe(true)
    expect(persistentStorageManager.attemptToMakeStoragePersistent).toHaveBeenCalled()
  })

  it('should return NOTIFICATION_PERMISSION_DENIED if notification permission is not granted on a Chromium-based browser', async () => {
    const { storageService } = makeStorageService({
      isStorageInitiallyPersistent: false,
      isChromiumBasedBrowser: true,
      grantNotificationPermission: false,
    })

    const result = await storageService.attemptToMakeStoragePersistent()

    expect(result).toBe(AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED)
    expect(storageService.state.isStoragePersistent).toBe(false)
  })
})

interface MakeStorageServiceOptions {
  isStorageInitiallyPersistent?: boolean
  isChromiumBasedBrowser?: boolean
  grantNotificationPermission?: boolean
  grantPersistentStorage?: boolean
}

const makeStorageService = ({
  isStorageInitiallyPersistent = false,
  isChromiumBasedBrowser = false,
  grantNotificationPermission = false,
  grantPersistentStorage = false,
}: MakeStorageServiceOptions) => {
  const persistentStorageManager = new MockPersistentStorageManager(
    isStorageInitiallyPersistent,
    grantPersistentStorage,
  )
  const permissionManager = new MockPermissionManager(grantNotificationPermission)
  const systemDetector = new MockSystemDetectorTestSupport(isChromiumBasedBrowser)
  const storageService = new StorageService(persistentStorageManager, permissionManager, systemDetector)
  return { storageService, persistentStorageManager, permissionManager, systemDetector }
}
