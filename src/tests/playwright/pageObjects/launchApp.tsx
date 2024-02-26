import { MountFunction } from '../types.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp } from '../TestApp.tsx'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'

export const launchApp = (mount: MountFunction): Promise<SoundsEditorPageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp />)
    return SoundsEditorPageObject.verifyIsShown(mountResult)
  })
