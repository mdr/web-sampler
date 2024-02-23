import { EditSoundPaneTestIds } from '../EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { getDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { useAudioContext } from '../../../audioRecorder/AudioContextProvider.ts'
import { AudioBufferUtils } from '../../../audioRecorder/AudioBufferUtils.ts'
import { getCroppedPcm } from '../../../types/SoundAudio.ts'
import FileSaver from 'file-saver'

interface DownloadWavButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadWavButton = ({ sound }: DownloadWavButtonProps) => {
  const audioContext = useAudioContext()

  const doDownload = () => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const arrayBuffer = audioBufferUtils.pcmToWavArrayBuffer(getCroppedPcm(sound.audio))
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' })
    FileSaver.saveAs(blob, `${getDisplayName(sound)}.wav`)
  }
  return (
    <Button
      testId={EditSoundPaneTestIds.downloadWavButton}
      icon={mdiDownload}
      label="Download WAV"
      onPress={doDownload}
    />
  )
}
