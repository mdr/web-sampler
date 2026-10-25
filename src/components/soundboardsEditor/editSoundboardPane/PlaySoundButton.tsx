import { mdiPlay } from '@mdi/js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SoundWithDefiniteAudio, getSoundDisplayName } from '../../../types/Sound.ts'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import { useObjectUrl } from '../../../utils/hooks/useObjectUrl.ts'
import { unawaited } from '../../../utils/utils.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { SoundTileIconButton } from './SoundTileIconButton.tsx'

export interface PlaySoundButtonProps {
  sound: SoundWithDefiniteAudio
}

export const PlaySoundButton = ({ sound }: PlaySoundButtonProps) => {
  const { audio } = sound
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const blob = useMemo(() => pcmToWavBlob(getPlayRegionAudioData(audio)), [audio])
  const url = useObjectUrl(blob)

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement !== null) {
      audioElement.volume = audio.volume
    }
  }, [audio.volume])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement !== null) {
      audioElement.addEventListener('ended', handleAudioEnded)
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnded)
      }
    }
  }, [handleAudioEnded])

  const handlePress = () => {
    const audioElement = audioRef.current
    if (audioElement !== null) {
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
      <SoundTileIconButton
        testId={EditSoundboardPaneTestIds.editSoundButton}
        label={`Play sound ${getSoundDisplayName(sound)}`}
        icon={mdiPlay}
        onPress={handlePress}
      />
    </>
  )
}
