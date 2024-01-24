import { MountFunction } from '../types.ts'
import { HomePageObject } from './HomePageObject.ts'
import { test } from '@playwright/experimental-ct-react'
import { TestApp, TestAppProps } from '../TestApp.tsx'
import { doNothing } from '../../../utils/utils.ts'

export const launchApp = (
  mount: MountFunction,
  { onStateChange = doNothing }: Partial<TestAppProps> = {},
): Promise<HomePageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<TestApp onStateChange={onStateChange} />)
    return new HomePageObject(mountResult)
  })
