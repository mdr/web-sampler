import { mdiFileImport } from '@mdi/js'
import Bowser from 'bowser'
import _ from 'lodash'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useFilePicker } from 'use-file-picker'
import { SelectedFiles } from 'use-file-picker/types'

import { useAudioOperations } from '../../../audioOperations/audioOperationsHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { AudioData } from '../../../types/AudioData.ts'
import { SoundId } from '../../../types/Sound.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Pcm, Seconds } from '../../../utils/types/brandedTypes.ts'
import { Button } from '../../shared/Button.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { MAX_RECORDING_DURATION } from '../recordingConstants.ts'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { ImportingAudioDialog } from './ImportingAudioDialog.tsx'

export interface ImportAudioButtonProps {
  soundId: SoundId
}

const getSupportedAudioExtensionsForBrowser = (): string[] => {
  const extensions = ['.wav', '.mp3', '.ogg', '.aac', '.flac', '.m4a', '.weba']
  // OGG container not supported on Safari: https://caniuse.com/ogg-vorbis
  if (Bowser.getParser(window.navigator.userAgent).getEngineName() === 'WebKit') {
    _.remove(extensions, (ext) => ext === '.ogg')
  }
  return extensions
}

export const ImportAudioButton = ({ soundId }: ImportAudioButtonProps) => {
  const [isImporting, setIsImporting] = useState(false)
  const soundActions = useSoundActions()
  const audioOperations = useAudioOperations()
  const handleFilesSuccessfullySelected = async ({ filesContent }: SelectedFiles<ArrayBuffer>): Promise<void> => {
    setIsImporting(true)
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
      soundActions.setAudioData(soundId, truncatedAudioData)
      if (audioData.pcm.length > truncatedAudioData.pcm.length) {
        toast.warning(`Audio was truncated to ${MAX_RECORDING_DURATION} seconds.`)
      }
    }
    setIsImporting(false)
  }

  const { openFilePicker, loading } = useFilePicker({
    readAs: 'ArrayBuffer',
    accept: getSupportedAudioExtensionsForBrowser(),
    onFilesSuccessfullySelected: handleFilesSuccessfullySelected,
  })

  const handleButtonPress = () => {
    openFilePicker()
  }

  return (
    <>
      <Button
        testId={EditSoundPaneTestIds.importAudioButton}
        icon={mdiFileImport}
        label="Import Audio"
        onPress={handleButtonPress}
      />
      <Modal isOpen={loading || isImporting}>
        <ImportingAudioDialog />
      </Modal>
    </>
  )
}

const truncateAudioData = (audioData: AudioData, duration: Seconds): AudioData => {
  const { pcm, sampleRate } = audioData
  const sampleCount = Math.floor(duration * sampleRate)
  const truncatedPcm = Pcm(pcm.slice(0, sampleCount))
  return { pcm: truncatedPcm, sampleRate }
}
