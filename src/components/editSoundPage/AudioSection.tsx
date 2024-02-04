import { EditSoundPageTestIds } from './EditSoundPage.testIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { Url } from '../../utils/types/Url.ts'
import { useMemo } from 'react'
import { AudioBufferUtils } from '../../audio/AudioBufferUtils.ts'
import { useObjectUrlCreator } from '../../utils/hooks.ts'

export interface AudioSectionProps {
  audio: Float32Array
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const createObjectUrl = useObjectUrlCreator()

  const audioUrl: Url = useMemo(() => {
    const audioBufferUtils = new AudioBufferUtils(new AudioContext())
    return createObjectUrl(audioBufferUtils.float32ArrayToWavBlob(audio))
  }, [audio, createObjectUrl])

  return (
    <>
      <audio data-testid={EditSoundPageTestIds.audioElement} src={audioUrl} controls />
      <WaveformVisualiser audio={audio} />
    </>
  )
}
