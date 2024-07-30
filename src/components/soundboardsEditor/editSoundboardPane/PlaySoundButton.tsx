import { useCallback, useEffect, useRef, useState } from 'react'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'
import { unawaited } from '../../../utils/utils.ts'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { getSoundDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { mdiPlay } from '@mdi/js'
import { SoundTileButton } from './SoundTileButton.tsx'

export interface PlaySoundButtonProps {
  sound: SoundWithDefiniteAudio
}

export const PlaySoundButton = ({ sound }: PlaySoundButtonProps) => {
  const { audio } = sound
  const [url, setUrl] = useState<Option<Url>>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audioData = getPlayRegionAudioData(audio)
    const blob = pcmToWavBlob(audioData)
    const objectUrl = Url(URL.createObjectURL(blob))
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
    if (audioElement !== undefined) {
      audioElement.volume = audio.volume
    }
  }, [audio.volume])

  useEffect(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
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

  return (
    <>
      <audio ref={audioRef} src={url} hidden></audio>
      <SoundTileButton
        testId={EditSoundboardPaneTestIds.editSoundButton}
        ariaLabel={`Play sound ${getSoundDisplayName(sound)}`}
        icon={mdiPlay}
        onPress={handlePress}
      />
    </>
  )
}
