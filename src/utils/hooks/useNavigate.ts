import { NavigateOptions, To, useNavigate as useReactRouterNavigate } from 'react-router-dom'

// NavigateFunction returns void | Promise<void>, which is fiddly to work with
type BetterNavigateFunction = (to: To, options?: NavigateOptions) => void

export const useNavigate = (): BetterNavigateFunction => {
  const reactRouterNavigate = useReactRouterNavigate()
  return (to, options) => void reactRouterNavigate(to, options)
}
