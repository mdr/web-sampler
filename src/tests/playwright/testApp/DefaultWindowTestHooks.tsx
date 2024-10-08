import { InstalledClock } from '@sinonjs/fake-timers'

import { AudioRecorderState, StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { SoundLibrary } from '../../../sounds/library/SoundLibrary.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Millis, Seconds, Volume } from '../../../utils/types/brandedTypes.ts'
import { MockAudioElement } from '../mocks/MockAudioElement.ts'
import { MockAudioRecorder } from '../mocks/MockAudioRecorder.ts'
import { WindowTestHooks } from './WindowTestHooks.ts'
import { serialiseSounds } from './soundsSerialisation.ts'

export class DefaultWindowTestHooks implements WindowTestHooks {
  constructor(
    private readonly audioRecorder: MockAudioRecorder,
    private readonly audioElement: MockAudioElement,
    private readonly clock: Option<InstalledClock>,
    private readonly soundLibrary: SoundLibrary,
  ) {}

  simulateAudioRecordingVolume = (volume: Volume): void => {
    this.audioRecorder.volume = volume
  }

  primeStartRecordingOutcome = (outcome: StartRecordingOutcome): void => {
    this.audioRecorder.startRecordingOutcome = outcome
  }

  primeNoAudioOnStopRecording = (): void => {
    this.audioRecorder.noAudioOnStopRecording = true
  }

  getAudioRecorderState = (): AudioRecorderState => this.audioRecorder.state

  simulateAudioPlaybackComplete = () => {
    this.audioElement.completePlayback()
  }

  isAudioPlaying = (): boolean => !this.audioElement.paused

  getAudioPosition = (): Seconds => Seconds(this.audioElement.currentTime)

  getAudioPlaybackVolume = (): Volume => Volume(this.audioElement.volume)

  clockNext = () => this.clock?.next()

  clockTick = (millis: Millis): void => {
    this.clock?.tick(millis)
  }

  getSoundsJson = (): string => serialiseSounds(this.soundLibrary.sounds)

  getSoundboardsJson = (): string => JSON.stringify(this.soundLibrary.soundboards, null, 2)

  visitNotFoundPage = () => {
    window.location.hash = '#/not-found'
  }
}
