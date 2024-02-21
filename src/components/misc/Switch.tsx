import React, { ReactElement, ReactNode } from 'react'
import { Option } from '../../utils/types/Option.ts'

export interface SwitchProps {
  children: ReactNode
}

export interface CaseProps {
  children: ReactNode
  condition?: boolean
}

export const Switch: React.FC<SwitchProps> = ({ children }) => {
  let match: Option<ReactElement> = undefined
  let defaultCase: Option<ReactElement> = undefined

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ('condition' in child.props && child.props.condition) {
        match = child
      } else if (!('condition' in child.props)) {
        defaultCase = child
      }
    }
  })

  return match ? React.cloneElement(match) : defaultCase
}

export const Case: React.FC<CaseProps> = ({ children }) => <>{children}</>
export const Default: React.FC<{ children: ReactNode }> = ({ children }) => <Case>{children}</Case>
