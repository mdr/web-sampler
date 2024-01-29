import { expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { App } from '../../../components/App.tsx'
import { MockAudioRecorder } from '../../playwright/mocks/MockAudioRecorder.ts'
import { NavbarTestIds } from '../../../components/NavbarTestIds.ts'
import { CapturePageTestIds } from '../../../components/capture/CapturePage.testIds.ts'
import { VolumeMeterTestIds } from '../../../components/capture/VolumeMeter.testIds.ts'

interface TestContext {
  audioRecorder: MockAudioRecorder
}

abstract class PageObject {
  constructor(protected readonly testContext: TestContext) {}
}

class NavbarPageObject extends PageObject {
  clickCapture = async (): Promise<CapturePageObject> => {
    await userEvent.click(screen.getByTestId(NavbarTestIds.capture))
    return new CapturePageObject(this.testContext)
  }
}

class HomePageObject extends PageObject {
  get navbar(): NavbarPageObject {
    return new NavbarPageObject(this.testContext)
  }
}

class CapturePageObject extends PageObject {
  pressRecordButton = (): Promise<void> => userEvent.click(screen.getByTestId(CapturePageTestIds.recordButton))

  setVolume = (volume: number) => (this.testContext.audioRecorder.volume = volume)

  expectVolumeMeterToShowLevel = async (volume: number): Promise<void> => {
    const volumeMeter = await screen.findByTestId(VolumeMeterTestIds.bar)
    await waitFor(() => expect(volumeMeter).toHaveAttribute('data-volume', volume.toString()))
  }
}

test('has capture screen', async () => {
  const audioRecorder = new MockAudioRecorder()
  render(<App audioRecorder={audioRecorder} />)
  const homePage = new HomePageObject({ audioRecorder })
  const capturePage = await homePage.navbar.clickCapture()

  await capturePage.pressRecordButton()

  capturePage.setVolume(50)
  await capturePage.expectVolumeMeterToShowLevel(50)
})
