import { AudioOperations } from '../audioOperations/AudioOperations.ts'
import { useContext } from 'react'
import { AudioOperationsContext } from '../audioOperations/AudioOperationsContext.ts'

export const useAudioOperations = (): AudioOperations => {
  const audioOperations = useContext(AudioOperationsContext)
  if (audioOperations === undefined) {
    throw new Error('no AudioOperations available in context')
  }
  return audioOperations
}
