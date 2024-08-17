import Icon from '@mdi/react'
import { Button } from 'react-aria-components'

import { TestId } from '../../../utils/types/brandedTypes.ts'

export interface SoundTileIconButtonProps {
  testId: TestId
  label: string
  icon: string
  onPress?(): void
}

export const SoundTileIconButton = ({ testId, label, icon, onPress }: SoundTileIconButtonProps) => (
  <Button
    data-testid={testId}
    className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
    onPress={onPress}
    aria-label={label}
  >
    <Icon title={label} path={icon} size={1} />
  </Button>
)
