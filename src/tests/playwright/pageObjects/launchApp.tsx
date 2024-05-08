import { MountFunction } from '../types.ts'
import { expect, MountResult, test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'
import { SoundsEditorPageObject } from './SoundsEditorPageObject.ts'
import { NotFoundPageObject } from './NotFoundPageObject.ts'
import { ProxyWindowTestHooks } from '../testApp/ProxyWindowTestHooks.ts'

const areTestHooksInstalled = (mountResult: MountResult): Promise<boolean> =>
  mountResult.page().evaluate(() => window.testHooks.visitNotFoundPage !== undefined)

const waitForTestHooksToBeInstalled = (mountResult: MountResult): Promise<void> =>
  expect.poll(() => areTestHooksInstalled(mountResult), { message: 'Wait for test hooks to be ready' }).toBe(true)

const mountAppAndWaitForTestHooks = async (mount: MountFunction, props: TestAppProps = {}): Promise<MountResult> => {
  const mountResult = await mount(<TestApp {...props} />)
  await waitForTestHooksToBeInstalled(mountResult)
  return mountResult
}

export const launchApp = (mount: MountFunction, props: TestAppProps = {}): Promise<SoundsEditorPageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mountAppAndWaitForTestHooks(mount, props)
    return SoundsEditorPageObject.verifyIsShown(mountResult)
  })

export const launchNotFoundPage = (mount: MountFunction, props: TestAppProps = {}): Promise<NotFoundPageObject> =>
  test.step('launchNotFoundPage', async () => {
    const mountResult = await mountAppAndWaitForTestHooks(mount, props)
    await new ProxyWindowTestHooks(mountResult).visitNotFoundPage()
    return await NotFoundPageObject.verifyIsShown(mountResult)
  })
