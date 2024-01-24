import { test } from '@playwright/experimental-ct-react'
import { launchApp } from './pageObjects/launchApp.tsx'
import { AudioRecorderStateChangeListener } from '../../audio/IAudioRecorder.ts'

test('recording audio from the Capture page should work', async ({ mount }) => {
  const onStateChange: AudioRecorderStateChangeListener = (state) => {
    console.log('state', state)
  }
  const homePage = await launchApp(mount, { onStateChange })

  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  await capturePage.setVolume(50)
  await capturePage.waitForVolumeMeterToShowLevel(50)

  await capturePage.pressStopButton()
})
