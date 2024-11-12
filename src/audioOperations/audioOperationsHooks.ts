import { useContext } from 'react'

import { AudioOperations } from './AudioOperations.ts'
import { AudioOperationsContext } from './AudioOperationsContext.ts'

export const useAudioOperations = (): AudioOperations => {
  const audioOperations = useContext(AudioOperationsContext)
  if (audioOperations === undefined) {
    throw new Error('no AudioOperations available in context')
  }
  return audioOperations
}
