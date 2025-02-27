import { mdiDownload } from '@mdi/js'
import saveAs from 'file-saver'

import { SoundWithDefiniteAudio, getSoundDisplayName } from '../../../types/Sound.ts'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

interface DownloadWavButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadWavButton = ({ sound }: DownloadWavButtonProps) => {
  const doDownload = () => {
    const audioData = getPlayRegionAudioData(sound.audio)
    const audioBlob = pcmToWavBlob(audioData)
    saveAs(audioBlob, `${getSoundDisplayName(sound)}.wav`, { autoBom: false })
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
