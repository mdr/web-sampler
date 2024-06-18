import React, { ReactElement, ReactNode } from 'react'
import { Option } from '../../utils/types/Option.ts'

export interface SwitchProps {
  children: ReactNode
}

export interface CaseProps {
  children: ReactNode
  condition?: boolean
}

const hasCondition = (props: unknown): props is { condition: boolean } => {
  return typeof props === 'object' && props !== null && 'condition' in props
}

export const Switch: React.FC<SwitchProps> = ({ children }) => {
  let match: Option<ReactElement> = undefined
  let defaultCase: Option<ReactElement> = undefined
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement(child)) {
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
  return match === undefined ? defaultCase : React.cloneElement(match)
}

export const Case: React.FC<CaseProps> = ({ children }) => <>{children}</>
export const Default: React.FC<{ children: ReactNode }> = ({ children }) => <Case>{children}</Case>
