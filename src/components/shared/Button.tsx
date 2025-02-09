import Icon from '@mdi/react'
import clsx from 'clsx'
import * as ReactAriaComponents from 'react-aria-components'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { ButtonVariant } from './ButtonVariant.tsx'

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
  variant = ButtonVariant.ORDINARY,
}: ButtonProps) => {
  if (iconOnly && icon === undefined) {
    throw new Error('An iconOnly Button must have an icon')
  }
  return (
    <ReactAriaComponents.Button
      data-testid={testId}
      aria-label={iconOnly ? label : undefined}
      className={clsx(
        'whitespace-nowrap rounded-sm py-2 text-white focus:outline-hidden focus:ring-2',
        variant === ButtonVariant.PRIMARY
          ? 'bg-blue-500 active:bg-blue-800 hover:bg-blue-700 focus:ring-blue-300'
          : variant === ButtonVariant.DANGEROUS
            ? 'bg-red-500 active:bg-red-800 hover:bg-red-700 focus:ring-red-300'
            : 'bg-gray-500 active:bg-gray-800 hover:bg-gray-700 focus:ring-gray-300',
        iconOnly ? 'px-2' : 'px-4',
      )}
      onPress={onPress}
    >
      <div className="flex grow">
        {icon && (
          <Icon className={clsx({ 'mr-2': !iconOnly })} path={icon} size={1} title={iconOnly ? label : undefined} />
        )}
        {!iconOnly && <span className="grow">{label}</span>}
      </div>
    </ReactAriaComponents.Button>
  )
}
