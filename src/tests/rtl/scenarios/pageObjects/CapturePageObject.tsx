import { PageObject } from './PageObject.tsx'
import { screen, waitFor } from '@testing-library/react'
import { CapturePageTestIds } from '../../../../components/capture/CapturePage.testIds.ts'
import { VolumeMeterTestIds } from '../../../../components/capture/VolumeMeter.testIds.ts'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { todo } from '../../../../utils/utils.ts'

export class CapturePageObject extends PageObject {
  pressRecordButton = (): Promise<void> => userEvent.click(screen.getByTestId(CapturePageTestIds.recordButton))
  pressStopButton = (): Promise<void> => userEvent.click(screen.getByTestId(CapturePageTestIds.stopButton))

  setVolume = (volume: number) => (this.testContext.audioRecorder.volume = volume)

  completeRecording = async (): Promise<void> => {
    const blob = new Blob([])
    this.testContext.audioRecorder.fireRecordingCompleteListeners(todo(), blob)
  }

  expectVolumeMeterToShowLevel = async (volume: number): Promise<void> => {
    const volumeMeter = await screen.findByTestId(VolumeMeterTestIds.bar)
    await waitFor(() => expect(volumeMeter).toHaveAttribute('data-volume', volume.toString()))
  }

  expectAudioElementToBeShown = async (): Promise<void> => {
    const audioElement = await screen.findByTestId(CapturePageTestIds.audioElement)
    expect(audioElement).toBeInTheDocument()
  }
}
