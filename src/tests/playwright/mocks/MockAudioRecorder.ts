import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from '../../../audio/AudioRecorder.ts'
import { AbstractAudioRecorder } from '../../../audio/AbstractAudioRecorder.ts'
import { Duration } from 'luxon'

export class MockAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  volume: number = 0
  startRecordingOutcome: StartRecordingOutcome = StartRecordingOutcome.SUCCESS
  blob: Blob = new Blob()

  startRecording = (): Promise<StartRecordingOutcome> => {
    if (this.startRecordingOutcome === StartRecordingOutcome.SUCCESS) {
      this.setState(AudioRecorderState.RECORDING)
    }
    return Promise.resolve(this.startRecordingOutcome)
  }

  stopRecording = (): void => {
    this.setState(AudioRecorderState.IDLE)
    const audioBuffer = createSilentAudioBuffer(new AudioContext(), Duration.fromMillis(100))
    this.fireRecordingCompleteListeners(audioBuffer)
  }
}

const createSilentAudioBuffer = (context: AudioContext, duration: Duration): AudioBuffer => {
  const sampleRate = context.sampleRate
  const buffer = context.createBuffer(1, sampleRate * duration.toMillis(), sampleRate)
  const channelData = buffer.getChannelData(0)
  channelData.fill(0)
  return buffer
}
