import { Context, createContext } from 'react'
import { Option } from '../utils/types/Option.ts'
import { ISoundLibrary } from './ISoundLibrary.ts'

export const SoundLibraryContext: Context<Option<ISoundLibrary>> = createContext<Option<ISoundLibrary>>(undefined)
