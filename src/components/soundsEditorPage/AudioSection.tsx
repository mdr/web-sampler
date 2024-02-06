import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { Url } from '../../utils/types/Url.ts'
import { useEffect, useRef, useState } from 'react'
import { AudioBufferUtils } from '../../audio/AudioBufferUtils.ts'
import { Option } from '../../utils/types/Option.ts'
import { useAudioContext } from '../../audio/AudioContextProvider.ts'
import { useRequestAnimationFrame } from '../../utils/hooks/useRequestAnimationFrame.ts'

export interface AudioSectionProps {
  audio: Float32Array
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const [audioUrl, setAudioUrl] = useState<Option<Url>>()
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null) // Ref to the audio element

  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.float32ArrayToWavBlob(audio)
    const objectUrl = Url(URL.createObjectURL(blob))
    setAudioUrl(objectUrl)
  }, [audio, audioContext])

  useRequestAnimationFrame(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
      setCurrentTime(audioElement.currentTime)
      setAudioDuration(audioElement.duration)
    }
  })

  const handlePositionChange = (position: number) => {
    if (audioRef.current !== null) {
      audioRef.current.currentTime = position
    }
  }

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser
        audio={audio}
        currentTime={currentTime}
        audioDuration={audioDuration}
        onPositionChange={handlePositionChange}
      />
      <audio ref={audioRef} className="mt-4" data-testid={EditSoundPaneTestIds.audioElement} src={audioUrl} controls />
    </div>
  )
}
