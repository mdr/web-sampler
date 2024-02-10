import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AbstractAudioRecorder } from '../../../audioRecorder/AbstractAudioRecorder.ts'
import { Duration } from 'luxon'
import { SOUND_DURATION } from '../testConstants.ts'

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
    if (this.state !== AudioRecorderState.RECORDING) {
      return
    }
    this.setState(AudioRecorderState.IDLE)
    this.fireRecordingCompleteListeners(createSineWave(SOUND_DURATION))
  }
}

const DEFAULT_SAMPLE_RATE = 48000

const createSineWave = (duration: Duration): Float32Array => {
  const durationInSeconds = duration.as('seconds')
  const numberOfSamples = DEFAULT_SAMPLE_RATE * durationInSeconds
  const channelData = new Float32Array(numberOfSamples)
  const frequency = 440
  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const time = sampleIndex / DEFAULT_SAMPLE_RATE
    const amplitude = Math.sin(2 * Math.PI * frequency * time)
    channelData[sampleIndex] = amplitude
  }

  return channelData
}
