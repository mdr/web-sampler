import React from 'react'
import { doNothing } from '../utils.ts'

import Icon from '@mdi/react'
import { mdiMicrophone } from '@mdi/js'

interface RecordButtonProps {
  onPress?: () => void
  enabled?: boolean
  children: React.ReactNode
}

export const RecordButton: React.FC<RecordButtonProps> = ({ onPress = doNothing, enabled = true, children }) => (
  <button
    className="bg-red-500 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring focus:ring-red-300 text-white font-bold py-2 px-4 rounded disabled:bg-pink-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onClick={onPress}
    disabled={!enabled}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiMicrophone} size={1} />
    {children}
  </button>
)
