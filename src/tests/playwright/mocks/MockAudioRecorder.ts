import {
  AudioRecorder,
  AudioRecorderState,
  CompletedRecording,
  StartRecordingOutcome,
} from '../../../audioRecorder/AudioRecorder.ts'
import { AbstractAudioRecorder } from '../../../audioRecorder/AbstractAudioRecorder.ts'
import { SOUND_DURATION } from '../testConstants.ts'
import { Hz, MIN_VOLUME, Pcm, Samples, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { DEFAULT_SAMPLE_RATE, samplesToSeconds, secondsToSamples } from '../../../types/soundConstants.ts'

export class MockAudioRecorder extends AbstractAudioRecorder implements AudioRecorder {
  volume: Volume = MIN_VOLUME
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
    const completedRecording: CompletedRecording = {
      pcm: createSampleAudio(SOUND_DURATION, DEFAULT_SAMPLE_RATE),
      sampleRate: DEFAULT_SAMPLE_RATE,
    }
    this.fireRecordingCompleteListeners(this.noAudioOnStopRecording ? undefined : completedRecording)
  }
}

const createSampleAudio = (duration: Seconds, sampleRate: Hz): Pcm => {
  const numberOfSamples = secondsToSamples(duration, sampleRate)
  const channelData = new Float32Array(numberOfSamples)
  const frequency = Hz(440)
  const lfoFrequency = 2

  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const time = samplesToSeconds(Samples(sampleIndex), sampleRate)
    const primarySine = Math.sin(2 * Math.PI * frequency * time)
    const lfoSine = Math.sin(2 * Math.PI * lfoFrequency * time)
    const amplitude = primarySine * ((lfoSine + 1) / 2)
    channelData[sampleIndex] = amplitude
  }
  return Pcm(channelData)
}
