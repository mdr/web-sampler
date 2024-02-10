import { Seconds, Url } from '../utils/types/brandedTypes.ts'

export interface AudioPlayer {
  play: () => Promise<void>
  pause: () => void
  setUrl: (url: Url) => void
  seek: (time: Seconds) => void

  readonly currentTime: Seconds
  readonly duration: Seconds

  addPlayListener(listener: () => void): void

  addPauseListener(listener: () => void): void

  addEndedListener(listener: () => void): void

  removePlayListener(listener: () => void): void

  removePauseListener(listener: () => void): void

  removeEndedListener(listener: () => void): void
}
