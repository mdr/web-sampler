import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { useEffect, useRef, useState } from 'react'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { Option } from '../../utils/types/Option.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useRequestAnimationFrame } from '../../utils/hooks/useRequestAnimationFrame.ts'
import { Seconds, Url } from '../../utils/types/brandedTypes.ts'
import Icon from '@mdi/react'
import { mdiPause, mdiPlay } from '@mdi/js'
import { Button } from 'react-aria-components'
import { unawaited } from '../../utils/utils.ts'

export interface AudioSectionProps {
  audio: Float32Array
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<Option<Url>>()
  const [currentPosition, setCurrentPosition] = useState(Seconds(0))
  const [audioDuration, setAudioDuration] = useState(Seconds(0))
  const audioElementRef = useRef<HTMLAudioElement>(null)

  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.float32ArrayToWavBlob(audio)
    const objectUrl = Url(URL.createObjectURL(blob))
    setAudioUrl(objectUrl)
  }, [audio, audioContext])

  useRequestAnimationFrame(() => {
    const audioElement = audioElementRef.current ?? undefined
    if (audioElement !== undefined) {
      setCurrentPosition(Seconds(audioElement.currentTime))
      setAudioDuration(Seconds(audioElement.duration))
    }
  })

  const handlePositionChange = (position: Seconds) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = position
    }
  }

  useEffect(() => {
    const audioElement = audioElementRef.current ?? undefined
    if (audioElement === undefined) {
      return
    }
    const handleAudioPlay = () => setIsPlaying(true)
    const handleAudioPause = () => setIsPlaying(false)
    const handleAudioEnd = () => setIsPlaying(false)

    audioElement.addEventListener('play', handleAudioPlay)
    audioElement.addEventListener('pause', handleAudioPause)
    audioElement.addEventListener('ended', handleAudioEnd)

    return () => {
      audioElement.removeEventListener('play', handleAudioPlay)
      audioElement.removeEventListener('pause', handleAudioPause)
      audioElement.removeEventListener('ended', handleAudioEnd)
    }
  }, [])

  const togglePlayPause = () => {
    const audioElement = audioElementRef.current ?? undefined
    if (audioElement === undefined) {
      return
    }
    if (isPlaying) {
      audioElement.pause()
    } else {
      unawaited(audioElement.play())
    }
  }

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser
        audio={audio}
        currentPosition={currentPosition}
        audioDuration={audioDuration}
        onPositionChange={handlePositionChange}
      />
      <audio ref={audioElementRef} hidden className="mt-4" src={audioUrl} controls />
      <Button
        onPress={togglePlayPause}
        className="mt-4 flex items-center justify-center p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        data-testid={isPlaying ? EditSoundPaneTestIds.pauseButton : EditSoundPaneTestIds.playButton}
      >
        <Icon path={isPlaying ? mdiPause : mdiPlay} size={1} />
      </Button>
    </div>
  )
}