import { useAudioRecorderVolume } from '../../audio/audioRecorderHooks.ts'
import { SoundsEditorPageTestIds } from './SoundsEditorPage.testIds.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolume()
  const volumeBarStyle = { height: `${volume}%` }
  return (
    <div className="w-8 h-20 bg-gray-200 rounded flex flex-col justify-end">
      <div
        data-volume={volume}
        data-testid={SoundsEditorPageTestIds.volumeMeter}
        style={volumeBarStyle}
        className="bg-green-500 w-full rounded-b"
      />
    </div>
  )
}
