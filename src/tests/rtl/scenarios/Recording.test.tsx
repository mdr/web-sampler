import { test } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { App } from '../../../components/App.tsx'
import { MockAudioRecorder } from '../../playwright/mocks/MockAudioRecorder.ts'
import { HomePageObject } from './pageObjects/HomePageObject.tsx'

test('recording audio from the Capture page', async () => {
  const audioRecorder = new MockAudioRecorder()
  render(<App audioRecorder={audioRecorder} />)
  const homePage = new HomePageObject({ audioRecorder })
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  capturePage.setVolume(50)
  await capturePage.expectVolumeMeterToShowLevel(50)

  await capturePage.pressStopButton()
  // await capturePage.completeRecording()
  // await capturePage.expectAudioElementToBeShown()
})
