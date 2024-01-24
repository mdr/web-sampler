import { Context, createContext, useContext } from 'react'
import { IAudioRecorder } from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'

export const AudioRecorderContext: Context<Option<IAudioRecorder>> = createContext<Option<IAudioRecorder>>(undefined)

export const useAudioRecorder = (): IAudioRecorder => {
  const audioRecorder = useContext(AudioRecorderContext)
  if (audioRecorder === undefined) {
    throw new Error('no AudioRecorderContext set')
  }
  return audioRecorder
}
