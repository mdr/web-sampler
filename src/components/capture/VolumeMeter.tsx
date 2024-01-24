import React from 'react'
import { VolumeMeterTestIds } from './VolumeMeter.testIds.ts'

type VolumeMeterProps = {
  volume: number
}

export const VolumeMeter: React.FC<VolumeMeterProps> = ({ volume }) => {
  const volumeBarStyle = {
    height: `${Math.min(volume, 100)}%`, // Ensure the height doesn't exceed 100%
  }
  return (
    <div className="w-8 h-20 bg-gray-200 rounded flex flex-col justify-end">
      <div
        data-volume={volume}
        data-testId={VolumeMeterTestIds.bar}
        style={volumeBarStyle}
        className="bg-green-500 w-full rounded-b"
      />
    </div>
  )
}
