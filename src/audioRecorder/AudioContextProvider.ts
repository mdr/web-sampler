import { Option } from '../utils/types/Option.ts'

export interface AudioContextProvider {
  readonly audioContext: AudioContext
}

export class LazyAudioContextProvider implements AudioContextProvider {
  private _audioContext: Option<AudioContext> = undefined

  get audioContext(): AudioContext {
    this._audioContext ??= new AudioContext()
    return this._audioContext
  }
}
