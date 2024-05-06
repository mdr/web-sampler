import { test } from '@playwright/experimental-ct-react'
import { launchNotFoundPage } from '../pageObjects/launchApp.tsx'

test('not found page is shown for an unknown page', async ({ mount }) => {
  const notFoundPage = await launchNotFoundPage(mount)

  await notFoundPage.checkScreenshot('not-found-page')
})
