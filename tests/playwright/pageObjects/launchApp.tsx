import { MountFunction } from '../types'
import { HomePage } from './HomePage'
import { App } from '../../../src/components/App'
import { test } from '@playwright/experimental-ct-react'

export const launchApp = async (mount: MountFunction): Promise<HomePage> =>
  await test.step('launchApp', async () => {
    const mountResult = await mount(<App />)
    return new HomePage(mountResult)
  })
