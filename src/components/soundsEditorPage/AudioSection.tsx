import { SoundsEditorPageTestIds } from './SoundsEditorPage.testIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { Url } from '../../utils/types/Url.ts'
import { useEffect, useState } from 'react'
import { AudioBufferUtils } from '../../audio/AudioBufferUtils.ts'
import { Option } from '../../utils/types/Option.ts'
import { useAudioContext } from '../../audio/AudioContextProvider.ts'

export interface AudioSectionProps {
  audio: Float32Array
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const [audioUrl, setAudioUrl] = useState<Option<Url>>()
  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.float32ArrayToWavBlob(audio)
    const objectUrl = Url(URL.createObjectURL(blob))
    setAudioUrl(objectUrl)
  }, [audio, audioContext])

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser audio={audio} />
      <audio className="mt-4" data-testid={SoundsEditorPageTestIds.audioElement} src={audioUrl} controls />
    </div>
  )
}
