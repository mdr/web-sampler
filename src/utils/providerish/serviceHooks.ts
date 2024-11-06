import { Context, createContext, useCallback, useContext, useEffect, useState } from 'react'

import { Option } from '../types/Option.ts'
import { AbstractService } from './AbstractService.ts'

export const createOptionalContext = <T>(): Context<Option<T>> => createContext<Option<T>>(undefined)

export const useService = <T>(context: Context<Option<T>>): T => {
  const service = useContext(context)
  if (service === undefined) {
    throw new Error('Cannot find service in context - Provider missing?')
  }
  return service
}

export const useServiceStateSelector = <State, Service extends AbstractService<State>, Selected>(
  context: Context<Option<Service>>,
  selector: (state: State) => Selected,
): Selected => {
  const service = useService(context)
  const [selectedState, setSelectedState] = useState(selector(service.state))
  const handleUpdate = useCallback(() => setSelectedState(selector(service.state)), [service, selector])
  useEffect(() => {
    service.addListener(handleUpdate)
    return () => service.removeListener(handleUpdate)
  }, [service, handleUpdate])
  return selectedState
}
