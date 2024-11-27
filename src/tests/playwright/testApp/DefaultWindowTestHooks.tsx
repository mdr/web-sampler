import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import { SoundLibrary } from '../../../sounds/library/SoundLibrary.ts'
import { Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { MockAudioElement } from '../mocks/MockAudioElement.testSupport.ts'
import { MockAudioRecorderService } from '../mocks/MockAudioRecorderService.testSupport.ts'
import { WindowTestHooks } from './WindowTestHooks.ts'
import { serialiseSounds } from './soundsSerialisation.ts'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorderService: MockAudioRecorderService,
    private readonly audioElement: MockAudioElement,
    private readonly soundLibrary: SoundLibrary,
  ) {}

  simulateAudioRecordingVolume = (volume: Volume): void => {
    this.audioRecorderService.setVolume(volume)
  }

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): void => {
    this.audioRecorderService.startRecordingOutcome = outcome
  }

  primeNoAudioOnStopRecording = (): void => {
    this.audioRecorderService.noAudioOnStopRecording = true
  }

  getAudioRecorderStatus = (): AudioRecorderStatus => this.audioRecorderService.state.status

  simulateAudioPlaybackComplete = () => {
    this.audioElement.completePlayback()
  }

  isAudioPlaying = (): boolean => !this.audioElement.paused

  getAudioPosition = (): Seconds => Seconds(this.audioElement.currentTime)

  setAudioPosition = (position: Seconds) => {
    this.audioElement.currentTime = position
  }

  getAudioPlaybackVolume = (): Volume => Volume(this.audioElement.volume)

  getSoundsJson = (): string => serialiseSounds(this.soundLibrary.sounds)

  getSoundboardsJson = (): string => JSON.stringify(this.soundLibrary.soundboards, null, 2)

  visitNotFoundPage = () => {
    window.location.hash = '#/not-found'
  }
}
