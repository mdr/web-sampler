import { createOptionalContext, useService, useServiceStateSelector } from '../utils/providerish/serviceHooks.ts'
import { StorageManager, StorageManagerActions, StorageManagerState } from './StorageManager.tsx'

export const StorageManagerContext = createOptionalContext<StorageManager>()

export const useStorageManagerState = <Selected = StorageManagerState>(
  selector: (state: StorageManagerState) => Selected = (state) => state as Selected,
): Selected => useServiceStateSelector<StorageManagerState, StorageManager, Selected>(StorageManagerContext, selector)

export const useStorageManagerActions = (): StorageManagerActions => useService(StorageManagerContext)
