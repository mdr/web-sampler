import { SOUND_DURATION } from '../testConstants.ts'
import _ from 'lodash'
import { Seconds } from '../../../utils/types/brandedTypes.ts'

export const castPartial = <T>(thing: Partial<T>): T => thing as T

type AudioElementListener<K extends keyof HTMLMediaElementEventMap> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this: HTMLAudioElement, ev: HTMLMediaElementEventMap[K]) => any

/**
 * The subset of the HTMLAudioElement interface that we need to implement in our mock.
 */
export interface PartialAudioElement extends Partial<HTMLAudioElement> {
  src: string
  currentTime: number
  readonly duration: number
  readonly paused: boolean
  readonly ended: boolean
  play: () => Promise<void>
  pause: () => void
  addEventListener: <K extends keyof HTMLMediaElementEventMap>(type: K, listener: AudioElementListener<K>) => void
  removeEventListener: <K extends keyof HTMLMediaElementEventMap>(type: K, listener: AudioElementListener<K>) => void
}

export class MockAudioElement implements PartialAudioElement {
  private _currentTime: Seconds = Seconds(0)

  get currentTime(): number {
    return this._currentTime
  }

  set currentTime(value: number) {
    this._currentTime = Seconds(value)
  }

  private _src: string = ''
  get src(): string {
    return this._src
  }

  set src(value: string) {
    this._currentTime = Seconds(0)
    this._src = value
    this._paused = true
    this._ended = false
    this.fireLoadStartListeners()
    this._duration = Seconds(value === '' ? Number.NaN : SOUND_DURATION)
  }

  private _paused: boolean = true

  get paused(): boolean {
    return this._paused
  }

  private _duration: Seconds = Seconds(Number.NaN)
  get duration(): number {
    return this._duration
  }

  private _ended: boolean = false
  get ended(): boolean {
    return this._ended
  }

  play = async (): Promise<void> => {
    if (this.currentTime >= this.duration) {
      this.currentTime = 0
    }
    this._paused = false
    this._ended = false
    this.firePlayListeners()
  }

  pause(): void {
    this._paused = true
    this.firePauseListeners()
  }

  private playListeners: AudioElementListener<'play'>[] = []
  private pauseListeners: AudioElementListener<'pause'>[] = []
  private endedListeners: AudioElementListener<'ended'>[] = []
  private loadStartListeners: AudioElementListener<'loadstart'>[] = []

  private firePlayListeners = () =>
    this.playListeners.forEach((listener) => listener.call(castPartial<HTMLAudioElement>(this), new Event('play')))

  private firePauseListeners = () =>
    this.pauseListeners.forEach((listener) => listener.call(castPartial<HTMLAudioElement>(this), new Event('pause')))

  private fireEndedListeners = () =>
    this.endedListeners.forEach((listener) => listener.call(castPartial<HTMLAudioElement>(this), new Event('ended')))

  private fireLoadStartListeners = () =>
    this.loadStartListeners.forEach((listener) =>
      listener.call(castPartial<HTMLAudioElement>(this), new Event('loadstart')),
    )

  addEventListener<K extends keyof HTMLMediaElementEventMap>(type: K, listener: AudioElementListener<K>): void {
    switch (type) {
      case 'play':
        this.playListeners.push(listener as AudioElementListener<'play'>)
        break
      case 'pause':
        this.pauseListeners.push(listener as AudioElementListener<'pause'>)
        break
      case 'ended':
        this.endedListeners.push(listener as AudioElementListener<'ended'>)
        break
      case 'loadstart':
        this.loadStartListeners.push(listener as AudioElementListener<'loadstart'>)
        break
      default:
        throw new Error(`Unexpected event type: ${type}`)
    }
  }

  removeEventListener<K extends keyof HTMLMediaElementEventMap>(type: K, listener: AudioElementListener<K>): void {
    switch (type) {
      case 'play':
        _.remove<AudioElementListener<'play'>>(this.playListeners, listener)
        break
      case 'pause':
        _.remove<AudioElementListener<'pause'>>(this.pauseListeners, listener)
        break
      case 'ended':
        _.remove<AudioElementListener<'ended'>>(this.endedListeners, listener)
        break
      case 'loadstart':
        _.remove<AudioElementListener<'loadstart'>>(this.loadStartListeners, listener)
        break
    }
  }

  /**
   * Simulate the audio element reaching the end of the audio and stopping.
   */
  completePlayback = () => {
    this.currentTime = this.duration

    this._paused = true
    this.firePauseListeners()

    this._ended = true
    this.fireEndedListeners()
  }
}
