import { mdiDownload } from '@mdi/js'
import { getSoundDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import FileSaver from 'file-saver'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'

interface DownloadWavButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadWavButton = ({ sound }: DownloadWavButtonProps) => {
  const doDownload = () => {
    const audioData = getPlayRegionAudioData(sound.audio)
    const audioBlob = pcmToWavBlob(audioData)
    FileSaver.saveAs(audioBlob, `${getSoundDisplayName(sound)}.wav`)
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
