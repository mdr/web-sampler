import { mdiFileImport } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { SoundId } from '../../../types/Sound.ts'
import { useFilePicker } from 'use-file-picker'
import { SelectedFiles } from 'use-file-picker/types'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { useAudioOperations } from '../../../audioOperations/audioOperationsHooks.ts'

export interface ImportAudioButtonProps {
  soundId: SoundId
}

export const ImportAudioButton = ({ soundId }: ImportAudioButtonProps) => {
  const soundActions = useSoundActions()
  const audioOperations = useAudioOperations()
  const handleFilesSuccessfullySelected = async ({ filesContent }: SelectedFiles<ArrayBuffer>): Promise<void> => {
    const arrayBuffer = filesContent[0].content
    const { pcm, sampleRate } = await audioOperations.importAudio(arrayBuffer)
    soundActions.setAudioPcm(soundId, pcm, sampleRate)
  }

  const { openFilePicker } = useFilePicker({
    readAs: 'ArrayBuffer',
    accept: ['.wav', '.mp3', '.ogg', '.aac', '.flac', '.m4a', '.weba'],
    onFilesSuccessfullySelected: handleFilesSuccessfullySelected,
  })

  return (
    <Button
      testId={EditSoundPaneTestIds.importAudioButton}
      icon={mdiFileImport}
      label="Import Audio"
      onPress={openFilePicker}
    />
  )
}
