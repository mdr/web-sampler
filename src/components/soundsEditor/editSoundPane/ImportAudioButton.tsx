import { mdiFileImport } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { SoundId } from '../../../types/Sound.ts'
import { useFilePicker } from 'use-file-picker'
import { SelectedFiles } from 'use-file-picker/types'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { useAudioOperations } from '../../../audioOperations/audioOperationsHooks.ts'
import { toast } from 'react-toastify'
import { Option } from '../../../utils/types/Option.ts'
import { AudioData } from '../../../types/AudioData.ts'
import { Pcm, Seconds } from '../../../utils/types/brandedTypes.ts'
import { MAX_RECORDING_DURATION } from '../recordingConstants.ts'

export interface ImportAudioButtonProps {
  soundId: SoundId
}

export const SUPPORTED_AUDIO_EXTENSIONS = ['.wav', '.mp3', '.ogg', '.aac', '.flac', '.m4a', '.weba']

export const ImportAudioButton = ({ soundId }: ImportAudioButtonProps) => {
  const soundActions = useSoundActions()
  const audioOperations = useAudioOperations()
  const handleFilesSuccessfullySelected = async ({ filesContent }: SelectedFiles<ArrayBuffer>): Promise<void> => {
    const arrayBuffer = filesContent[0].content
    let audioData: Option<AudioData>
    try {
      audioData = await audioOperations.importAudio(arrayBuffer)
    } catch (e) {
      console.error('Error importing audio', e)
      toast.error('Error importing audio.')
    }
    if (audioData !== undefined) {
      const truncatedAudioData = truncateAudioData(audioData, MAX_RECORDING_DURATION)
      soundActions.setAudioPcm(soundId, truncatedAudioData)
      if (audioData.pcm.length > truncatedAudioData.pcm.length) {
        toast.warning(`Audio was truncated to ${MAX_RECORDING_DURATION} seconds.`)
      }
    }
  }

  const { openFilePicker } = useFilePicker({
    readAs: 'ArrayBuffer',
    accept: SUPPORTED_AUDIO_EXTENSIONS,
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

const truncateAudioData = (audioData: AudioData, duration: Seconds): AudioData => {
  const { pcm, sampleRate } = audioData
  const sampleCount = Math.floor(duration * sampleRate)
  const truncatedPcm = Pcm(pcm.slice(0, sampleCount))
  return { pcm: truncatedPcm, sampleRate }
}
