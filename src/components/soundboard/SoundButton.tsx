import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiPlay } from '@mdi/js'
import { Sound } from '../../types/Sound.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useEffect, useRef, useState } from 'react'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { unawaited } from '../../utils/utils.ts'

export interface SoundButtonProps {
  sound: Sound
}

export const SoundButton = ({ sound }: SoundButtonProps) => {
  const { audio } = sound
  const [url, setUrl] = useState<string | undefined>(undefined)
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

  const handlePress = () => {
    if (audioRef.current && audio !== undefined) {
      audioRef.current.currentTime = audio.startTime
      unawaited(audioRef.current.play())

      const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.currentTime >= audio.finishTime) {
          audioRef.current.pause()
          audioRef.current.currentTime = audio.startTime
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        }
      }

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={url} style={{ display: 'none' }}></audio>
      <Button
        key={sound.id}
        className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-2 shadow-md hover:bg-gray-100"
        onPress={handlePress}
      >
        <span className="z-10 text-sm">{sound.name}</span>
        <div className="mt-2 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <div className="rounded-full bg-gray-200 p-2">
            <Icon path={mdiPlay} size={1} color="gray" />
          </div>
        </div>
      </Button>
    </>
  )
}
