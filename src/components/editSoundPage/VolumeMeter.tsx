import { useAudioRecorderVolume } from '../../audio/audioRecorderHooks.ts'
import { EditSoundPageTestIds } from './EditSoundPage.testIds.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolume()
  const volumeBarStyle = { height: `${volume}%` }
  return (
    <div className="w-8 h-20 bg-gray-200 rounded flex flex-col justify-end">
      <div
        data-volume={volume}
        data-testid={EditSoundPageTestIds.volumeMeter}
        style={volumeBarStyle}
        className="bg-green-500 w-full rounded-b"
      />
    </div>
  )
}
