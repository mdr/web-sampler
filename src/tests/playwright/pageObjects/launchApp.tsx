import { MountFunction } from '../types.ts'
import { HomePageObject } from './HomePageObject.ts'
import { App, AppProps } from '../../../components/App.tsx'
import { test } from '@playwright/experimental-ct-react'
import { defaultAudioRecorderFactory } from '../../../audio/AudioRecorder.ts'

export const launchApp = (
  mount: MountFunction,
  { audioRecorderFactory = defaultAudioRecorderFactory }: Partial<AppProps> = {},
): Promise<HomePageObject> =>
  test.step('launchApp', async () => {
    const mountResult = await mount(<App audioRecorderFactory={audioRecorderFactory} />)
    return new HomePageObject(mountResult)
  })
