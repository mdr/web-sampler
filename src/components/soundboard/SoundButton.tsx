import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiPlay } from '@mdi/js'
import { getDisplayName, SoundWithDefiniteAudio } from '../../types/Sound.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { unawaited } from '../../utils/utils.ts'
import { Option } from '../../utils/types/Option.ts'
import { useHotkeys } from 'react-hotkeys-hook'
import { getPlayRegionPcm } from '../../types/SoundAudio.ts'
import clsx from 'clsx'
import { pcmToWavBlob } from '../../utils/wav.ts'

export interface SoundButtonProps {
  sound: SoundWithDefiniteAudio
  hotkey: string
}

export const SoundButton = ({ sound, hotkey }: SoundButtonProps) => {
  const { audio } = sound
  const [url, setUrl] = useState<Option<string>>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const blob = pcmToWavBlob(getPlayRegionPcm(audio))
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [audio])

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

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
    if (audioElement !== undefined) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.currentTime = 0
        setIsPlaying(true)
        unawaited(audioElement.play())
      }
    }
  }

  const handleHotkeyPress = () => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
      audioElement.currentTime = 0
      setIsPlaying(true)
      unawaited(audioElement.play())
    }
  }

  useHotkeys(hotkey, handleHotkeyPress, [handleHotkeyPress])

  return (
    <>
      <audio ref={audioRef} src={url} hidden></audio>
      <Button
        key={sound.id}
        className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-5 shadow-md hover:bg-gray-100"
        onPress={handlePress}
      >
        <span className="relative z-10 block h-[100px] overflow-hidden text-sm">
          {getDisplayName(sound)}
          <span className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent group-hover:from-gray-100"></span>
        </span>{' '}
        <kbd className="absolute right-1 top-1 rounded bg-gray-200 p-1">{hotkey}</kbd>
        <div className="mt-2 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className={clsx('rounded-full bg-gray-200 p-2 ', { 'animate-ping': isPlaying })}>
            <Icon path={mdiPlay} size={1} color="gray" />
          </div>
        </div>
      </Button>
    </>
  )
}
