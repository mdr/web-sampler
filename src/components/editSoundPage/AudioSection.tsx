import { EditSoundPageTestIds } from './EditSoundPage.testIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { Url } from '../../utils/types/Url.ts'
import { useEffect, useState } from 'react'
import { AudioBufferUtils } from '../../audio/AudioBufferUtils.ts'
import { Option } from '../../utils/types/Option.ts'

export interface AudioSectionProps {
  audio: Float32Array
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const [audioUrl, setAudioUrl] = useState<Option<Url>>()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(new AudioContext())
    const blob = audioBufferUtils.float32ArrayToWavBlob(audio)
    const objectUrl = Url(URL.createObjectURL(blob))
    setAudioUrl(objectUrl)
  }, [audio])

  return (
    <>
      <audio data-testid={EditSoundPageTestIds.audioElement} src={audioUrl} controls />
      <WaveformVisualiser audio={audio} />
    </>
  )
}
