import { VolumeMeterTestIds } from './VolumeMeter.testIds.ts'
import { useAudioRecorderVolume } from '../../audio/audioRecorderHooks.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolume()
  const volumeBarStyle = { height: `${volume}%` }
  return (
    <div className="w-8 h-20 bg-gray-200 rounded flex flex-col justify-end">
      <div
        data-volume={volume}
        data-testid={VolumeMeterTestIds.bar}
        style={volumeBarStyle}
        className="bg-green-500 w-full rounded-b"
      />
    </div>
  )
}
