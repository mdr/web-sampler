import AsyncLock from 'async-lock'

import { Option } from '../utils/types/Option.ts'
import { Seconds, Url, Volume } from '../utils/types/brandedTypes'
import { unawaited } from '../utils/utils.ts'
import { AudioPlayer } from './AudioPlayer'

export class DefaultAudioPlayer implements AudioPlayer {
  private url: Option<Url> = undefined

  constructor(readonly audioElement: HTMLAudioElement) {}

  // Lock to force play/pause operations to be sequential
  private lock: AsyncLock = new AsyncLock()

  get isPlaying(): boolean {
    return !this.audioElement.paused
  }

  setUrl = (url: Option<Url>) => {
    this.url = url
    this.audioElement.src = url ?? ''
  }

  setVolume = (volume: Volume) => (this.audioElement.volume = volume)

  play = (): Promise<void> =>
    this.lock.acquire('lock', async () => {
      if (this.url !== undefined) {
        return this.audioElement.play()
      }
    })

  pause = () => unawaited(this.lock.acquire('lock', () => this.audioElement.pause()))

  seek = (time: Seconds) => {
    if (time < 0) {
      throw new Error(`Cannot seek to negative time: ${time} seconds`)
    }
    return (this.audioElement.currentTime = time)
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
