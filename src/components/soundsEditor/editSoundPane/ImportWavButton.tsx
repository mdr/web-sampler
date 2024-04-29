import { mdiFileImport } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { SoundId } from '../../../types/Sound.ts'
import { useFilePicker } from 'use-file-picker'
import { SelectedFiles } from 'use-file-picker/types'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { useAudioOperations } from '../../../audioOperations/audioOperationsHooks.ts'

export interface ImportWavButtonProps {
  soundId: SoundId
}

export const ImportWavButton = ({ soundId }: ImportWavButtonProps) => {
  const soundActions = useSoundActions()
  const audioOperations = useAudioOperations()
  const handleFilesSuccessfullySelected = async ({ filesContent }: SelectedFiles<ArrayBuffer>): Promise<void> => {
    const arrayBuffer = filesContent[0].content
    const { pcm, sampleRate } = await audioOperations.importAudio(arrayBuffer)
    soundActions.setAudioPcm(soundId, pcm, sampleRate)
  }

  const { openFilePicker } = useFilePicker({
    readAs: 'ArrayBuffer',
    accept: '.wav',
    onFilesSuccessfullySelected: handleFilesSuccessfullySelected,
  })

  const handlePress = () => openFilePicker()

  return (
    <Button
      testId={EditSoundPaneTestIds.importWavButton}
      icon={mdiFileImport}
      label="Import WAV"
      onPress={handlePress}
    />
  )
}
