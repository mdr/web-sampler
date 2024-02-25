import { Seconds } from '../utils/types/brandedTypes.ts'
import { AudioPlayerActions } from './audioPlayerHooks.ts'

export interface PlayWindow {
  readonly start: Seconds
  readonly finish: Seconds
}

export interface AudioPlayer extends AudioPlayerActions {
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
