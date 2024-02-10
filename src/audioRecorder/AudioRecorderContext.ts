import { Context, createContext } from 'react'
import { AudioRecorder } from './AudioRecorder.ts'
import { Option } from '../utils/types/Option.ts'

export const AudioRecorderContext: Context<Option<AudioRecorder>> = createContext<Option<AudioRecorder>>(undefined)
