import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { TestId } from '../../../utils/types/brandedTypes.ts'

export interface SoundTileButtonProps {
  testId: TestId
  ariaLabel: string
  icon: string
  onPress(): void
}

export const SoundTileButton = ({ testId, ariaLabel, icon, onPress }: SoundTileButtonProps) => (
  <Button
    data-testid={testId}
    className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
    onPress={onPress}
    aria-label={ariaLabel}
  >
    <Icon title={ariaLabel} path={icon} size={1} />
  </Button>
)
