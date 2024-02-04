import { Context, createContext } from 'react'
import { IAudioRecorder } from './IAudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'

export const AudioRecorderContext: Context<Option<IAudioRecorder>> = createContext<Option<IAudioRecorder>>(undefined)
