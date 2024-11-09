import { createOptionalContext, useService, useServiceStateSelector } from '../utils/providerish/serviceHooks.ts'
import { StorageActions, StorageService, StorageState } from './StorageService.ts'

export const StorageManagerContext = createOptionalContext<StorageService>()

export const useStorageManagerState = <Selected = StorageState>(
  selector: (state: StorageState) => Selected = (state) => state as Selected,
): Selected => useServiceStateSelector<StorageState, StorageService, Selected>(StorageManagerContext, selector)

export const useStorageManagerActions = (): StorageActions => useService(StorageManagerContext)
