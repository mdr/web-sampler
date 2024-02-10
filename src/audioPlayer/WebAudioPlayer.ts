import { Seconds, Url } from '../utils/types/brandedTypes'
import { AudioPlayer } from './AudioPlayer'

export class WebAudioPlayer implements AudioPlayer {
  private readonly audioElement: HTMLAudioElement = new Audio()

  setUrl = (url: Url) => {
    this.audioElement.src = url
  }

  play = (): Promise<void> => this.audioElement.play()

  pause = () => this.audioElement.pause()

  seek = (time: Seconds) => {
    this.audioElement.currentTime = time
  }

  get currentTime(): Seconds {
    return Seconds(this.audioElement.currentTime)
  }

  get duration(): Seconds {
    return Seconds(this.audioElement.duration)
  }

  addPlayListener = (listener: () => void) => this.audioElement.addEventListener('play', listener)

  addPauseListener = (listener: () => void) => this.audioElement.addEventListener('pause', listener)

  addEndedListener = (listener: () => void) => this.audioElement.addEventListener('ended', listener)

  removePlayListener = (listener: () => void) => this.audioElement.removeEventListener('play', listener)

  removePauseListener = (listener: () => void) => this.audioElement.removeEventListener('pause', listener)

  removeEndedListener = (listener: () => void) => this.audioElement.removeEventListener('ended', listener)
}
