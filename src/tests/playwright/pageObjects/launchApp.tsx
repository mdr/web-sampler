import { MountFunction } from '../types.ts'
import { HomePageObject } from './HomePageObject.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'

export const launchApp = (mount: MountFunction, props: Partial<TestAppProps> = {}): Promise<HomePageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp {...props} />)
    return HomePageObject.verifyIsShown(mountResult)
  })
