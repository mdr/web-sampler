import React from 'react'
import Icon from '@mdi/react'
import { mdiStop } from '@mdi/js'
import { doNothing } from '../../utils/utils.ts'
import { TestId } from '../../utils/types/TestId.ts' // Importing the stop icon

interface StopButtonProps {
  testId?: TestId
  onPress?: () => void
  enabled?: boolean
  children: React.ReactNode
}

export const StopButton: React.FC<StopButtonProps> = ({ onPress = doNothing, enabled = true, children, testId }) => (
  <button
    data-testid={testId}
    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onClick={onPress}
    disabled={!enabled}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiStop} size={1} />
    {children}
  </button>
)
