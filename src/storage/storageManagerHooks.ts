import { useCallback, useContext, useEffect, useState } from 'react'
import { StorageManagerContext } from './StorageManagerContext.ts'
import { StorageManager, StorageManagerActions, StorageManagerState } from './StorageManager.tsx'

const getStorageManagerState = (storageManager: StorageManager): StorageManagerState => ({
  isStoragePersistent: storageManager.isStoragePersistent,
})

const useStorageManager = () => {
  const storageManager = useContext(StorageManagerContext)
  if (storageManager === undefined) {
    throw new Error('no StorageManager available in context')
  }
  return storageManager
}

export const useStorageManagerState = (): StorageManagerState => {
  const storageManager = useStorageManager()
  const [state, setState] = useState(getStorageManagerState(storageManager))
  const handleUpdate = useCallback(() => setState(getStorageManagerState(storageManager)), [storageManager])
  useEffect(() => {
    storageManager.addListener(handleUpdate)
    return () => storageManager.removeListener(handleUpdate)
  }, [storageManager, handleUpdate])
  return state
}

export const useStorageManagerActions = (): StorageManagerActions => useStorageManager()
