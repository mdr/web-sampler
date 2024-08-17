import { Context, createContext } from 'react'

import { Option } from '../utils/types/Option.ts'
import { AudioRecorder } from './AudioRecorder.ts'

export const AudioRecorderContext: Context<Option<AudioRecorder>> = createContext<Option<AudioRecorder>>(undefined)
