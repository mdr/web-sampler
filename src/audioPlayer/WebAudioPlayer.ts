import { Seconds, Url } from '../utils/types/brandedTypes'
import { AudioPlayer, PlayWindow } from './AudioPlayer'
import { Option } from '../utils/types/Option.ts'

const END_TOLERANCE: Seconds = Seconds(0.1)

export class WebAudioPlayer implements AudioPlayer {
  private readonly audioElement: HTMLAudioElement = new Audio()
  private playWindow: Option<PlayWindow> = undefined

  get isPlaying(): boolean {
    return !this.audioElement.paused && this.audioElement.currentTime > 0
  }

  setUrl = (url: Option<Url>) => {
    this.audioElement.src = url ?? ''
  }

  setPlayWindow = (playWindow: PlayWindow) => {
    this.playWindow = playWindow
    if (this.audioElement.currentTime < playWindow.start || this.audioElement.currentTime > playWindow.finish) {
      this.seek(playWindow.start)
    }
  }

  play = (): Promise<void> => {
    if (this.playWindow !== undefined) {
      const currentTime = this.audioElement.currentTime
      const { start, finish } = this.playWindow
      if (currentTime < start || currentTime > finish - END_TOLERANCE) {
        this.seek(this.playWindow.start)
      }
    }
    return this.audioElement.play()
  }

  pause = () => this.audioElement.pause()

  seek = (time: Seconds) => {
    let actualTime = time
    if (this.playWindow !== undefined) {
      const { start, finish } = this.playWindow
      actualTime = Seconds(Math.max(start, Math.min(finish, time)))
    }
    this.audioElement.currentTime = actualTime
  }

  get currentTime(): Seconds {
    return Seconds(this.audioElement.currentTime)
  }

  get duration(): Seconds {
    const duration = this.audioElement.duration
    return Seconds(Number.isNaN(duration) ? 0 : duration)
  }

  addPlayListener = (listener: () => void) => this.audioElement.addEventListener('play', listener)

  addPauseListener = (listener: () => void) => this.audioElement.addEventListener('pause', listener)

  addEndedListener = (listener: () => void) => this.audioElement.addEventListener('ended', listener)

  addLoadStartListener = (listener: () => void) => this.audioElement.addEventListener('loadstart', listener)

  removePlayListener = (listener: () => void) => this.audioElement.removeEventListener('play', listener)

  removePauseListener = (listener: () => void) => this.audioElement.removeEventListener('pause', listener)

  removeEndedListener = (listener: () => void) => this.audioElement.removeEventListener('ended', listener)

  removeLoadStartListener = (listener: () => void) => this.audioElement.removeEventListener('loadstart', listener)
}
