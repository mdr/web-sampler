import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiPlay } from '@mdi/js'
import { Sound } from '../../types/Sound.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { unawaited } from '../../utils/utils.ts'
import { Option } from '../../utils/types/Option.ts'
import { useRequestAnimationFrame } from '../../utils/hooks/useRequestAnimationFrame.ts'
import { useHotkeys } from 'react-hotkeys-hook'

export interface SoundButtonProps {
  sound: Sound
  hotkey: string
}

export const SoundButton = ({ sound, hotkey }: SoundButtonProps) => {
  const { audio } = sound
  const [url, setUrl] = useState<Option<string>>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContext = useAudioContext()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audio !== undefined) {
      const audioBufferUtils = new AudioBufferUtils(audioContext)
      const blob = audioBufferUtils.pcmToWavBlob(audio.pcm)
      const objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [audioContext, audio])

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  const handleRaf = useCallback(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement && audio !== undefined) {
      if (audioElement.currentTime >= audio.finishTime) {
        audioElement.pause()
        setIsPlaying(false)
        audioElement.currentTime = audio.startTime
      }
    }
  }, [audio])

  useRequestAnimationFrame(handleRaf)

  useEffect(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded)
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnded)
      }
    }
  }, [audioRef, handleAudioEnded])

  const handlePress = () => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement && audio !== undefined) {
      audioElement.currentTime = audio.startTime
      setIsPlaying(true)
      unawaited(audioElement.play())
    }
  }

  useHotkeys(hotkey, handlePress, [handlePress])

  return (
    <>
      <audio ref={audioRef} src={url} style={{ display: 'none' }}></audio>
      <Button
        key={sound.id}
        className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-2 shadow-md hover:bg-gray-100"
        onPress={handlePress}
      >
        <span className="z-10 text-sm">{sound.name}</span>
        <div className="mt-2 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className={`rounded-full bg-gray-200 p-2 ${isPlaying ? 'animate-ping' : ''}`}>
            <Icon path={isPlaying ? mdiPlay : mdiPlay} size={1} color="gray" />
          </div>
        </div>
      </Button>
    </>
  )
}
