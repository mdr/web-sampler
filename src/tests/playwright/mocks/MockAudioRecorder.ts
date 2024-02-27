import { AudioRecorder, AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AbstractAudioRecorder } from '../../../audioRecorder/AbstractAudioRecorder.ts'
import { SOUND_DURATION } from '../testConstants.ts'
import { Pcm, Seconds } from '../../../utils/types/brandedTypes.ts'

import { DEFAULT_SAMPLE_RATE } from '../../../types/soundConstants.ts'

export class MockAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  volume: number = 0
  startRecordingOutcome: StartRecordingOutcome = StartRecordingOutcome.SUCCESS
  noAudioOnStopRecording: boolean = false

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
    this.fireRecordingCompleteListeners(this.noAudioOnStopRecording ? undefined : createSampleAudio(SOUND_DURATION))
  }
}

const createSampleAudio = (duration: Seconds): Pcm => {
  const numberOfSamples = DEFAULT_SAMPLE_RATE * duration
  const channelData = new Float32Array(numberOfSamples)
  const frequency = 440
  const lfoFrequency = 2

  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const time = sampleIndex / DEFAULT_SAMPLE_RATE
    const primarySine = Math.sin(2 * Math.PI * frequency * time)
    const lfoSine = Math.sin(2 * Math.PI * lfoFrequency * time)
    const amplitude = primarySine * ((lfoSine + 1) / 2)
    channelData[sampleIndex] = amplitude
  }
  return Pcm(channelData)
}
