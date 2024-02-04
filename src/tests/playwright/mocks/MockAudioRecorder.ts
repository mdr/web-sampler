import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { AbstractAudioRecorder } from '../../../audio/AbstractAudioRecorder.ts'
import { Duration } from 'luxon'

export class MockAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  volume: number = 0
  startRecordingOutcome: StartRecordingOutcome = StartRecordingOutcome.SUCCESS

  startRecording = (): Promise<StartRecordingOutcome> => {
    if (this.startRecordingOutcome === StartRecordingOutcome.SUCCESS) {
      this.setState(AudioRecorderState.RECORDING)
    }
    return Promise.resolve(this.startRecordingOutcome)
  }

  stopRecording = (): void => {
    this.setState(AudioRecorderState.IDLE)
    const audioBuffer = createSilentArrayBuffer(Duration.fromObject({ seconds: 1 }))
    this.fireRecordingCompleteListeners(audioBuffer)
  }
}

const DEFAULT_SAMPLE_RATE = 44100

const createSilentArrayBuffer = (duration: Duration): ArrayBuffer => {
  const durationInSeconds = duration.as('seconds')
  const numberOfSamples = DEFAULT_SAMPLE_RATE * durationInSeconds
  const channelData = new Float32Array(numberOfSamples)
  channelData.fill(0)
  return channelData.buffer
}
