import { MountFunction } from '../types.ts'
import { expect, test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'
import { NotFoundPageObject } from './NotFoundPageObject.ts'

export const launchApp = (mount: MountFunction, props: TestAppProps = {}): Promise<SoundsEditorPageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp {...props} />)
    return SoundsEditorPageObject.verifyIsShown(mountResult)
  })

export const launchNotFoundPage = (mount: MountFunction): Promise<NotFoundPageObject> => {
  return test.step('launchNotFoundPage', async () => {
    const mountResult = await mount(<TestApp />)
    await expect
      .poll(() => mountResult.page().evaluate(() => window.testHooks.visitNotFoundPage()), {
        message: 'Visit not found page',
        timeout: 1000,
      })
      .toBe(true)
    return await NotFoundPageObject.verifyIsShown(mountResult)
  })
}
