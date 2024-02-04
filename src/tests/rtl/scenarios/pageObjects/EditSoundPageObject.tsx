import { PageObject } from './PageObject.tsx'
import { screen, waitFor } from '@testing-library/react'
import { EditSoundPageTestIds } from '../../../../components/capture/EditSoundPage.testIds.ts'
import { VolumeMeterTestIds } from '../../../../components/capture/VolumeMeter.testIds.ts'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { todo } from '../../../../utils/utils.ts'

export class EditSoundPageObject extends PageObject {
  pressRecordButton = (): Promise<void> => userEvent.click(screen.getByTestId(EditSoundPageTestIds.recordButton))
  pressStopButton = (): Promise<void> => userEvent.click(screen.getByTestId(EditSoundPageTestIds.stopButton))

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
    const audioElement = await screen.findByTestId(EditSoundPageTestIds.audioElement)
    expect(audioElement).toBeInTheDocument()
  }
}
