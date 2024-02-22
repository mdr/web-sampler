import { AudioPlayer, PlayWindow } from '../../../audioPlayer/AudioPlayer.ts'
import { Seconds } from '../../../utils/types/brandedTypes.ts'
import _ from 'lodash'
import { SOUND_DURATION } from '../testConstants.ts'
import { Option } from '../../../utils/types/Option.ts'

export class MockAudioPlayer implements AudioPlayer {
  isPlaying: boolean = false
  currentTime: Seconds = Seconds(0)
  duration: Seconds = Seconds(SOUND_DURATION.toMillis() / 1000)
  playWindow: Option<PlayWindow> = undefined

  play = async (): Promise<void> => {
    this.isPlaying = true
    if (this.playWindow !== undefined) {
      const { start, finish } = this.playWindow
      if (this.currentTime < start || this.currentTime >= finish) {
        this.currentTime = this.playWindow.start
      }
    }
    this.firePlayListeners()
  }

  pause = (): void => {
    this.isPlaying = false
    this.firePauseListeners()
  }

  setUrl = () => {
    this.isPlaying = false
    this.currentTime = Seconds(0)
    this.fireLoadStartListeners()
  }

  setPlayWindow = (playWindow: PlayWindow) => {
    this.playWindow = playWindow
    if (this.currentTime < playWindow.start || this.currentTime > playWindow.finish) {
      this.seek(playWindow.start)
    }
  }

  seek = (time: Seconds) => {
    console.log('seeking to', time)
    this.currentTime = time
  }

  private readonly playListeners: (() => void)[] = []
  private readonly pauseListeners: (() => void)[] = []
  private readonly endedListeners: (() => void)[] = []
  private readonly loadStartListeners: (() => void)[] = []

  addPlayListener = (listener: () => void) => {
    this.playListeners.push(listener)
  }

  removePlayListener = (listener: () => void) => {
    _.remove(this.playListeners, listener)
  }

  firePlayListeners = () => {
    this.playListeners.forEach((listener) => listener())
  }

  addPauseListener = (listener: () => void) => {
    this.pauseListeners.push(listener)
  }

  removePauseListener = (listener: () => void) => {
    _.remove(this.pauseListeners, listener)
  }

  firePauseListeners = () => {
    this.pauseListeners.forEach((listener) => listener())
  }

  addEndedListener = (listener: () => void): void => {
    this.endedListeners.push(listener)
  }

  removeEndedListener = (listener: () => void): void => {
    _.remove(this.endedListeners, listener)
  }

  fireEndedListeners = () => {
    this.endedListeners.forEach((listener) => listener())
  }

  addLoadStartListener = (listener: () => void): void => {
    this.loadStartListeners.push(listener)
  }

  removeLoadStartListener = (listener: () => void): void => {
    _.remove(this.loadStartListeners, listener)
  }

  fireLoadStartListeners = () => {
    this.loadStartListeners.forEach((listener) => listener())
  }

  completePlayback = () => {
    if (!this.isPlaying) {
      throw new Error('Cannot complete playback when not playing')
    }
    this.isPlaying = false
    this.currentTime = this.duration
    this.fireEndedListeners()
  }
}
