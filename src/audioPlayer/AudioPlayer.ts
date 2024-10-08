import { Seconds } from '../utils/types/brandedTypes.ts'
import { AudioPlayerActions } from './audioPlayerHooks.ts'

export interface AudioPlayer extends AudioPlayerActions {
  readonly isPlaying: boolean
  readonly currentTime: Seconds
  readonly duration: Seconds

  readonly addPlayListener: (listener: () => void) => void

  readonly addPauseListener: (listener: () => void) => void

  readonly addEndedListener: (listener: () => void) => void

  readonly addLoadStartListener: (listener: () => void) => void

  readonly removePlayListener: (listener: () => void) => void

  readonly removePauseListener: (listener: () => void) => void

  readonly removeEndedListener: (listener: () => void) => void

  readonly removeLoadStartListener: (listener: () => void) => void
}
