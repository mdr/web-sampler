import { Seconds, Url } from '../utils/types/brandedTypes.ts'
import { Option } from '../utils/types/Option.ts'

export interface PlayWindow {
  readonly start: Seconds
  readonly finish: Seconds
}

export interface AudioPlayer {
  play: () => Promise<void>
  pause: () => void
  setUrl: (url: Option<Url>) => void
  setPlayWindow: (playWindow: PlayWindow) => void
  seek: (time: Seconds) => void
  readonly isPlaying: boolean

  readonly currentTime: Seconds
  readonly duration: Seconds

  addPlayListener(listener: () => void): void

  addPauseListener(listener: () => void): void

  addEndedListener(listener: () => void): void

  addLoadStartListener(listener: () => void): void

  removePlayListener(listener: () => void): void

  removePauseListener(listener: () => void): void

  removeEndedListener(listener: () => void): void

  removeLoadStartListener(listener: () => void): void
}
