import { Option } from '../utils/types/Option.ts'
import { Context, createContext, useContext } from 'react'

export const AudioContextProviderContext: Context<Option<AudioContextProvider>> =
  createContext<Option<AudioContextProvider>>(undefined)

export const useAudioContext = (): AudioContext => {
  const audioContextProvider = useContext(AudioContextProviderContext)
  if (audioContextProvider === undefined) {
    throw new Error('AudioContextProvider not found')
  }
  return audioContextProvider.audioContext
}

export interface AudioContextProvider {
  readonly audioContext: AudioContext
}

export class LazyAudioContextProvider implements AudioContextProvider {
  private _audioContext: Option<AudioContext> = undefined

  get audioContext(): AudioContext {
    if (this._audioContext === undefined) {
      this._audioContext = new AudioContext()
    }
    return this._audioContext
  }
}
