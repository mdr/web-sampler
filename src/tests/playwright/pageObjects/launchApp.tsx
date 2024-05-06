import { MountFunction } from '../types.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'
import { NotFoundPageObject } from './NotFoundPageObject.ts'

export const launchApp = (mount: MountFunction, props: TestAppProps = {}): Promise<SoundsEditorPageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp {...props} />)
    return SoundsEditorPageObject.verifyIsShown(mountResult)
  })

export const launchNotFoundPage = (mount: MountFunction): Promise<NotFoundPageObject> =>
  test.step('launchNotFoundPage', async () => {
    const mountResult = await mount(<TestApp />)
    await mountResult.page().evaluate(() => window.testHooks.visitNotFoundPage())
    return await NotFoundPageObject.verifyIsShown(mountResult)
  })
