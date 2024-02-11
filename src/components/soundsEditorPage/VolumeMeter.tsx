import { useAudioRecorderVolumeRaf } from '../../audioRecorder/audioRecorderHooks.ts'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolumeRaf()
  const volumeBarStyle = { height: `${volume}%` }
  return (
    <div className="w-8 h-20 bg-gray-200 rounded flex flex-col justify-end">
      <div
        data-volume={volume}
        data-testid={EditSoundPaneTestIds.volumeMeter}
        style={volumeBarStyle}
        className="bg-green-500 w-full rounded-b"
      />
    </div>
  )
}
