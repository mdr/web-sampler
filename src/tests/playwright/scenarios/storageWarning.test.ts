import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'
import { AttemptToMakeStoragePersistentResult } from '../../../storage/StorageManager.tsx'

test('if storage has not been made persistent, a warning button is shown, and the user can attempt to fix it in a dialog', async ({
  mount,
}) => {
  const soundsEditorPage = await launchApp(mount, {
    attemptToMakeStoragePersistentResult: AttemptToMakeStoragePersistentResult.SUCCESSFUL,
  })
  await soundsEditorPage.navbar.expectStorageWarningButtonToBeShown()
  const dialog = await soundsEditorPage.navbar.pressStorageWarningButton()
  await dialog.checkScreenshot('storage-warning-dialog')

  await dialog.pressAttemptToMakeStoragePersistentButton()

  await soundsEditorPage.expectToastToBeShown('Storage is now persistent. Your recordings are safe in local storage.')
  await soundsEditorPage.navbar.expectStorageWarningDialogToNotBeShown()
})

test('if notification permission is denied, show an appropriate toast', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount, {
    attemptToMakeStoragePersistentResult: AttemptToMakeStoragePersistentResult.NOTIFICATION_PERMISSION_DENIED,
  })
  const dialog = await soundsEditorPage.navbar.pressStorageWarningButton()

  await dialog.pressAttemptToMakeStoragePersistentButton()

  await soundsEditorPage.expectToastToBeShown('Grant notification permission to make storage persistent.')
  await soundsEditorPage.navbar.expectStorageWarningDialogToBeShown()
})

test('if storage cannot be made persistent, show an appropriate toast', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount, {
    attemptToMakeStoragePersistentResult: AttemptToMakeStoragePersistentResult.UNSUCCESSFUL,
  })
  const dialog = await soundsEditorPage.navbar.pressStorageWarningButton()

  await dialog.pressAttemptToMakeStoragePersistentButton()

  await soundsEditorPage.expectToastToBeShown('Unable to make storage persistent.')
  await soundsEditorPage.navbar.expectStorageWarningDialogToBeShown()
})

test('if storage is already persistent, no warning button is shown', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount, {
    isStoragePersistent: true,
  })
  await soundsEditorPage.navbar.expectStorageWarningButtonToNotBeShown()
})
