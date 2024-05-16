import { mdiDownload } from '@mdi/js'
import { getSoundDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import FileSaver from 'file-saver'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'
import { pcmToMp3Blob } from '../../../utils/mp3.ts'

interface DownloadMp3ButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadMp3Button = ({ sound }: DownloadMp3ButtonProps) => {
  const doDownload = () => {
    const audioData = getPlayRegionAudioData(sound.audio)
    const mp3Blob = pcmToMp3Blob(audioData)
    FileSaver.saveAs(mp3Blob, `${getSoundDisplayName(sound)}.mp3`)
  }
  return (
    <Button
      testId={EditSoundPaneTestIds.downloadMp3Button}
      icon={mdiDownload}
      label="Download MP3"
      onPress={doDownload}
    />
  )
}
