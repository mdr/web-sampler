import React from 'react'
import { doNothing } from '../utils/utils.ts'

interface PrimaryButtonProps {
  onPress?: () => void
  enabled?: boolean
  children: React.ReactNode
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress = doNothing, enabled = true, children }) => (
  <button
    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400 disabled:cursor-not-allowed"
    onClick={onPress}
    disabled={!enabled}
  >
    {children}
  </button>
)
