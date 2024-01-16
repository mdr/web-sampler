import React from 'react'

interface PrimaryButtonProps {
  onPress: () => void
  children: React.ReactNode
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, children }) => (
  <button
    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 text-white font-bold py-2 px-4 rounded"
    onClick={onPress}
  >
    {children}
  </button>
)
