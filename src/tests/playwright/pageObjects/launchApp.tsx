import { MountFunction } from '../types.ts'
import { HomePage } from './HomePage.ts'
import { App } from '../../../components/App.tsx'
import { test } from '@playwright/experimental-ct-react'

export const launchApp = async (mount: MountFunction): Promise<HomePage> =>
  await test.step('launchApp', async () => {
    const mountResult = await mount(<App />)
    return new HomePage(mountResult)
  })
