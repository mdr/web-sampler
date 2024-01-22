import { MountFunction } from '../types.ts'
import { HomePageObject } from './HomePageObject.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp } from '../TestApp.tsx'

export const launchApp = (mount: MountFunction): Promise<HomePageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp />)
    return new HomePageObject(mountResult)
  })
