import { mdiDownload } from '@mdi/js'
import FileSaver from 'file-saver'

import { SoundWithDefiniteAudio, getSoundDisplayName } from '../../../types/Sound.ts'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import { pcmToMp3Blob } from '../../../utils/mp3.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

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
