import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { SoundWithDefiniteAudio } from '../../types/Sound.ts'
import { useState } from 'react'
import { Button } from '../shared/Button.tsx'
import { DoWavDownload } from './DoWavDownload.tsx'

interface DownloadWavButtonProps {
  sound: SoundWithDefiniteAudio
}

export const DownloadWavButton = ({ sound }: DownloadWavButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false)
  return (
    <>
      {isDownloading && <DoWavDownload sound={sound} onDownloaded={() => setIsDownloading(false)} />}
      <Button
        testId={EditSoundPaneTestIds.downloadWavButton}
        icon={mdiDownload}
        label="Download WAV"
        onPress={() => setIsDownloading(true)}
      />
    </>
  )
}
