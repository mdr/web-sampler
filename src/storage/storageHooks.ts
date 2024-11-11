import { createOptionalContext, useService, useServiceStateSelector } from '../utils/providerish/serviceHooks.ts'
import { StorageActions, StorageService, StorageState } from './StorageService.ts'

export const StorageServiceContext = createOptionalContext<StorageService>()

export const useStorageState = <Selected = StorageState>(
  selector: (state: StorageState) => Selected = (state) => state as Selected,
): Selected => useServiceStateSelector<StorageState, StorageService, Selected>(StorageServiceContext, selector)

export const useStorageActions = (): StorageActions => useService(StorageServiceContext)
