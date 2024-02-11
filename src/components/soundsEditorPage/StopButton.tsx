import React from 'react'
import Icon from '@mdi/react'
import { mdiStop } from '@mdi/js'
import { doNothing } from '../../utils/utils.ts'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { Button } from 'react-aria-components'

interface StopButtonProps {
  testId?: TestId
  onPress?: () => void
  children: React.ReactNode
}

export const StopButton: React.FC<StopButtonProps> = ({ onPress = doNothing, children, testId }) => (
  <Button
    data-testid={testId}
    className="flex items-center justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:text-gray-500"
    onPress={onPress}
  >
    <Icon className="mr-2 h-4 w-4" path={mdiStop} size={1} />
    {children}
  </Button>
)
