import { Context, createContext, useContext } from 'react'
import { AudioRecorderFactory } from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'

export const AudioRecorderFactoryContext: Context<Option<AudioRecorderFactory>> =
  createContext<Option<AudioRecorderFactory>>(undefined)

export const useAudioRecorderFactory = (): AudioRecorderFactory => {
  const audioRecorderFactory = useContext(AudioRecorderFactoryContext)
  if (audioRecorderFactory === undefined) {
    throw new Error('no AudioRecorderFactoryContext set')
  }
  return audioRecorderFactory
}
