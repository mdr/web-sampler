import { useAudioRecorderVolumeRaf } from '../../../audioRecorder/audioRecorderHooks.ts'

import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export const VolumeMeter = () => {
  const volume = useAudioRecorderVolumeRaf()
  // Scale up the volume to better fill the bar for typical audio:
  const displayVolume = Math.min(1, Math.max(0, volume * 2.5))
  const volumeBarStyle = { height: `${100 * displayVolume}%` }
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
