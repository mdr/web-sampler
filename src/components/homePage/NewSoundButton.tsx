import React from 'react'
import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { TestId } from '../../utils/types/TestId.ts'
import { doNothing } from '../../utils/utils.ts'

interface NewSoundButtonProps {
  testId?: TestId
  onPress?: () => void
  enabled?: boolean
  children: React.ReactNode
}

export const NewSoundButton: React.FC<NewSoundButtonProps> = ({
  onPress = doNothing,
  enabled = true,
  children,
  testId,
}) => (
  <button
    data-testid={testId}
    className="bg-green-500 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring focus:ring-green-300 text-white font-bold py-2 px-4 rounded disabled:bg-green-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onClick={onPress}
    disabled={!enabled}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiPlus} size={1} />
    {children}
  </button>
)
