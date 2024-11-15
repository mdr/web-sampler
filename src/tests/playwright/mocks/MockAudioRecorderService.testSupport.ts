import { LazyAudioContextProvider } from '../../../audioRecorder/AudioContextProvider.ts'
import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderService, AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { AudioData } from '../../../types/AudioData.ts'
import { samplesToSeconds, secondsToSamples } from '../../../types/sampleConversions.ts'
import { SoundTestConstants } from '../../../types/sound.testSupport.ts'
import { Hz, MIN_VOLUME, Pcm, Samples, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { SOUND_DURATION } from '../testConstants.ts'

export class MockAudioRecorderService extends AudioRecorderService {
  private _volume: Volume = MIN_VOLUME
  startRecordingOutcome: StartRecordingOutcome = StartRecordingOutcome.SUCCESS
  noAudioOnStopRecording: boolean = false

  constructor() {
    super(new LazyAudioContextProvider())
  }

  get volume(): Volume {
    return this._volume
  }

  setVolume = (volume: Volume): void => {
    this._volume = volume
  }

  startRecording = (): Promise<StartRecordingOutcome> => {
    if (this.startRecordingOutcome === StartRecordingOutcome.SUCCESS) {
      this.setState({ status: AudioRecorderStatus.RECORDING })
    }
    return Promise.resolve(this.startRecordingOutcome)
  }

  stopRecording = (): void => {
    if (this.state.status !== AudioRecorderStatus.RECORDING) {
      return
    }
    this.setState({ status: AudioRecorderStatus.IDLE })
    const audioData: AudioData = {
      pcm: createSampleAudio(SOUND_DURATION, SoundTestConstants.sampleRate),
      sampleRate: SoundTestConstants.sampleRate,
    }
    this.fireRecordingCompleteListeners(this.noAudioOnStopRecording ? undefined : audioData)
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
