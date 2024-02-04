import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { todo } from '../../../utils/utils.ts'
import { AbstractAudioRecorder } from '../../../audio/AbstractAudioRecorder.ts'

export class MockAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  volume: number = 0
  startRecordingOutcome: StartRecordingOutcome = StartRecordingOutcome.SUCCESS
  blob: Blob = new Blob()

  startRecording = async (): Promise<StartRecordingOutcome> => {
    if (this.startRecordingOutcome === StartRecordingOutcome.SUCCESS) {
      this.setState(AudioRecorderState.RECORDING)
    }
    return this.startRecordingOutcome
  }

  stopRecording = (): void => {
    this.setState(AudioRecorderState.IDLE)
    this.fireRecordingCompleteListeners(todo(), this.blob)
  }
}
