import Icon from '@mdi/react'
import * as ReactAriaComponents from 'react-aria-components'

import { TestId } from '../../utils/types/brandedTypes.ts'
import clsx from 'clsx'

export enum ButtonVariant {
  PRIMARY = 'PRIMARY',
  DANGEROUS = 'DANGEROUS',
}

export interface ButtonProps {
  testId?: TestId

  variant?: ButtonVariant

  icon?: string

  iconOnly?: boolean

  label: string

  onPress?(): void
}

export const Button = ({
  testId,
  icon,
  iconOnly = false,
  label,
  onPress,
  variant = ButtonVariant.PRIMARY,
}: ButtonProps) => {
  if (label === undefined && icon === undefined) {
    throw new Error('Button must have either a label or an icon')
  }
  return (
    <ReactAriaComponents.Button
      data-testid={testId}
      aria-label={iconOnly ? label : undefined}
      className={clsx(
        'flex rounded py-2 text-white focus:outline-none focus:ring-2',
        variant === ButtonVariant.PRIMARY
          ? 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-300 active:bg-blue-800'
          : 'bg-red-500 hover:bg-red-700 focus:ring-red-300 active:bg-red-800',
        iconOnly ? 'px-2' : 'px-4',
      )}
      onPress={onPress}
    >
      {icon && (
        <Icon className={clsx({ 'mr-2': !iconOnly })} path={icon} size={1} title={iconOnly ? label : undefined} />
      )}
      {!iconOnly && label}
    </ReactAriaComponents.Button>
  )
}
