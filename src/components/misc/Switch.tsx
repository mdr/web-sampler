import { Children, ReactElement, ReactNode, cloneElement, isValidElement } from 'react'

import { Option } from '../../utils/types/Option.ts'

export interface SwitchProps {
  children: ReactNode
}

const hasCondition = (props: unknown): props is { condition: boolean } => {
  return typeof props === 'object' && props !== null && 'condition' in props
}

export const Switch = ({ children }: SwitchProps) => {
  let match: Option<ReactElement> = undefined
  let defaultCase: Option<ReactElement> = undefined
  for (const child of Children.toArray(children)) {
    if (isValidElement(child)) {
      const childProps: unknown = child.props
      if (hasCondition(childProps)) {
        if (childProps.condition) {
          match = child
          break
        }
      } else {
        defaultCase = child
      }
    }
  }
  return match === undefined ? defaultCase : cloneElement(match)
}

export interface CaseProps {
  children: ReactNode
  condition?: boolean
}
export const Case = ({ children }: CaseProps) => <>{children}</>

export interface DefaultProps {
  children: ReactNode
}

export const Default = ({ children }: DefaultProps) => <Case>{children}</Case>
