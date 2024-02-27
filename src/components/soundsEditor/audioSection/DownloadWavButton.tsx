import { mdiDownload } from '@mdi/js'
import { getDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { getPlayRegionPcm } from '../../../types/SoundAudio.ts'
import FileSaver from 'file-saver'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'

interface DownloadWavButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadWavButton = ({ sound }: DownloadWavButtonProps) => {
  const doDownload = () => {
    const audioBlob = pcmToWavBlob(getPlayRegionPcm(sound.audio))
    FileSaver.saveAs(audioBlob, `${getDisplayName(sound)}.wav`)
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
