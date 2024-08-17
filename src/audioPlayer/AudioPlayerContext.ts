import { Context, createContext } from 'react'

import { Option } from '../utils/types/Option.ts'
import { AudioPlayer } from './AudioPlayer.ts'

export const AudioPlayerContext: Context<Option<AudioPlayer>> = createContext<Option<AudioPlayer>>(undefined)
