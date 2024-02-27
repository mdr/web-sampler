import { useAudioRecorderVolumeRaf } from '../../../audioRecorder/audioRecorderHooks.ts'

import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolumeRaf()
  const volumeBarStyle = { height: `${volume}%` }
  return (
    <div className="flex h-20 w-8 flex-col justify-end rounded bg-gray-200">
      <div
        data-volume={volume}
        data-testid={EditSoundPaneTestIds.volumeMeter}
        style={volumeBarStyle}
        className="w-full rounded-b bg-green-500"
      />
    </div>
  )
}
