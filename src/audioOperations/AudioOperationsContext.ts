import { Context, createContext } from 'react'

import { Option } from '../utils/types/Option.ts'
import { AudioOperations } from './AudioOperations.ts'

export const AudioOperationsContext: Context<Option<AudioOperations>> =
  createContext<Option<AudioOperations>>(undefined)
