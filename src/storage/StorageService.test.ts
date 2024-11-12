import { describe, expect, it, test, vi } from 'vitest'

import { mockObjectMethods } from '../utils/mockUtils.testSupport.ts'
import { FakeToastManager } from './FakeToastManager.testSupport.ts'
import { MockPermissionManager } from './MockPermissionManager.testSupport.ts'
import { MockPersistentStorageManager } from './MockPersistentStorageManager.testSupport.ts'
import { MockSystemDetectorTestSupport } from './MockSystemDetector.testSupport.ts'
import { StorageService, StorageServiceToastMessages } from './StorageService.ts'

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
  test('if storage is already persistent, post a success toast taking no action', async () => {
    const { storageService, permissionManager, persistentStorageManager, toastManager } = makeStorageService({
      isStorageInitiallyPersistent: true,
    })

    await storageService.attemptToMakeStoragePersistent()

    expect(toastManager.info).toHaveBeenCalledWith(StorageServiceToastMessages.SUCCESS)
    expect(storageService.state.isStoragePersistent).toBe(true)
    expect(persistentStorageManager.attemptToMakeStoragePersistent).not.toHaveBeenCalled()
    expect(permissionManager.requestNotificationPermission).not.toHaveBeenCalled()
  })

  it('should attempt to request persistent storage and post a success toast if successful', async () => {
    const { storageService, persistentStorageManager, toastManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      grantPersistentStorage: true,
    })

    await storageService.attemptToMakeStoragePersistent()

    expect(toastManager.info).toHaveBeenCalledWith(StorageServiceToastMessages.SUCCESS)
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
    const { storageService, toastManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      grantPersistentStorage: false,
    })

    await storageService.attemptToMakeStoragePersistent()

    expect(toastManager.error).toHaveBeenCalledWith(StorageServiceToastMessages.UNSUCCESSFUL)
    expect(storageService.state.isStoragePersistent).toBe(false)
  })

  it('should first attempt to request notification permission when on a Chromium-based browser', async () => {
    const { storageService, permissionManager, persistentStorageManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      isChromiumBasedBrowser: true,
      grantNotificationPermission: true,
      grantPersistentStorage: true,
    })

    await storageService.attemptToMakeStoragePersistent()

    expect(storageService.state.isStoragePersistent).toBe(true)
    expect(permissionManager.notificationPermissionGranted).toBe(true)
    expect(persistentStorageManager.attemptToMakeStoragePersistent).toHaveBeenCalled()
  })

  it('should return NOTIFICATION_PERMISSION_DENIED if notification permission is not granted on a Chromium-based browser', async () => {
    const { storageService, toastManager } = makeStorageService({
      isStorageInitiallyPersistent: false,
      isChromiumBasedBrowser: true,
      grantNotificationPermission: false,
    })

    await storageService.attemptToMakeStoragePersistent()

    expect(toastManager.error).toHaveBeenCalledWith(StorageServiceToastMessages.NOTIFICATION_PERMISSION_DENIED)
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
  const persistentStorageManager = mockObjectMethods(
    new MockPersistentStorageManager(isStorageInitiallyPersistent, grantPersistentStorage),
  )
  const permissionManager = mockObjectMethods(new MockPermissionManager(grantNotificationPermission))
  const systemDetector = new MockSystemDetectorTestSupport(isChromiumBasedBrowser)
  const toastManager = mockObjectMethods(new FakeToastManager())
  const storageService = new StorageService(persistentStorageManager, permissionManager, systemDetector, toastManager)
  return { storageService, persistentStorageManager, permissionManager, systemDetector, toastManager }
}
