import React from 'react'
import Icon from '@mdi/react'
import { mdiStop } from '@mdi/js'
import { doNothing } from '../../utils/utils.ts'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { Button } from 'react-aria-components'

interface StopButtonProps {
  testId?: TestId
  onPress?: () => void
}

export const StopButton: React.FC<StopButtonProps> = ({ onPress = doNothing, testId }) => (
  <Button
    data-testid={testId}
    className="flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 active:bg-blue-800"
    onPress={onPress}
  >
    <Icon className="mr-2 h-4 w-4" path={mdiStop} size={1} />
    Stop Capture
  </Button>
)
