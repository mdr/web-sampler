import { Context, createContext } from 'react'
import { Option } from '../../utils/types/Option.ts'
import { SoundLibrary } from './SoundLibrary.ts'

export const SoundLibraryContext: Context<Option<SoundLibrary>> = createContext<Option<SoundLibrary>>(undefined)
