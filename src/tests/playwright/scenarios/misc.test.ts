import { test } from '@playwright/experimental-ct-react'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('if storage has not been made persistent, a warning button is shown, and the user can attempt to fix it in a dialog', async ({
  mount,
}) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.navbar.expectStorageWarningButtonToBeShown()

  const dialog = await soundsEditorPage.navbar.pressStorageWarningButton()
  await dialog.checkScreenshot('storage-warning-dialog')

  await dialog.pressAttemptToMakeStoragePersistentButton()

  await soundsEditorPage.expectToastToBeShown('Storage is now persistent. Your recordings are safe in local storage.')
  await soundsEditorPage.navbar.expectStorageWarningDialogToNotBeShown()
})
