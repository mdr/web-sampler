import { Context, createContext } from 'react'
import { Option } from '../utils/types/Option.ts'
import { StorageManager } from './StorageManager.ts'

export const StorageManagerContext: Context<Option<StorageManager>> = createContext<Option<StorageManager>>(undefined)
