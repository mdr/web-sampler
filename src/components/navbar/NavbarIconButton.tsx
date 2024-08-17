import Icon from '@mdi/react'
import clsx from 'clsx'
import { Button as RacButton } from 'react-aria-components'

import { TestId } from '../../utils/types/brandedTypes.ts'

export interface NavbarIconButtonProps {
  label: string
  icon: string
  testId?: TestId
  disabled?: boolean

  onPress?(): void
}

export const NavbarIconButton = ({ label, icon, disabled = false, testId, onPress }: NavbarIconButtonProps) => (
  <RacButton
    data-testid={testId}
    aria-label={label}
    className={clsx('hover:text-gray-300', { 'cursor-not-allowed opacity-50': disabled })}
    onPress={onPress}
  >
    <Icon path={icon} size={1} title={label} />
  </RacButton>
)
