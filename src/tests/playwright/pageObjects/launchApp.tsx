import { MountFunction } from '../types.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'

export const launchApp = (mount: MountFunction, props: Partial<TestAppProps> = {}): Promise<SoundsEditorPageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp {...props} />)
    return SoundsEditorPageObject.verifyIsShown(mountResult)
  })
