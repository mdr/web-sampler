import { useCallback, useContext, useEffect, useState } from 'react'
import { AudioPlayer } from './AudioPlayer.ts'
import { AudioPlayerContext } from './AudioPlayerContext.ts'
import { Seconds, Url } from '../utils/types/brandedTypes.ts'
import { useRequestAnimationFrame } from '../utils/hooks/useRequestAnimationFrame.ts'
import { Option } from '../utils/types/Option.ts'

const useAudioPlayer = (): AudioPlayer => {
  const audioPlayer = useContext(AudioPlayerContext)
  if (audioPlayer === undefined) {
    throw new Error('no AudioPlayer available in context')
  }
  return audioPlayer
}

export const useAudioPlayerIsPlaying = (): boolean => {
  const audioPlayer = useAudioPlayer()
  const [isPlaying, setIsPlaying] = useState<boolean>(audioPlayer.isPlaying)
  const handlePlay = useCallback(() => setIsPlaying(true), [setIsPlaying])
  const handlePauseOrEnded = useCallback(() => setIsPlaying(false), [setIsPlaying])
  useEffect(() => {
    audioPlayer.addPlayListener(handlePlay)
    audioPlayer.addPauseListener(handlePauseOrEnded)
    audioPlayer.addEndedListener(handlePauseOrEnded)
    audioPlayer.addLoadStartListener(handlePauseOrEnded)
    return () => {
      audioPlayer.removePlayListener(handlePlay)
      audioPlayer.removePauseListener(handlePauseOrEnded)
      audioPlayer.removeEndedListener(handlePauseOrEnded)
      audioPlayer.removeLoadStartListener(handlePauseOrEnded)
    }
  }, [audioPlayer, setIsPlaying, handlePlay, handlePauseOrEnded])
  return isPlaying
}

export const useAudioPlayerCurrentTimeAndDurationRaf = (): [Seconds, Seconds] => {
  const audioPlayer = useAudioPlayer()
  const [currentTime, setCurrentTime] = useState<Seconds>(audioPlayer.currentTime)
  const [duration, setDuration] = useState<Seconds>(audioPlayer.duration)
  const handleAnimationFrame = useCallback(() => {
    setCurrentTime(audioPlayer.currentTime)
    setDuration(audioPlayer.duration)
  }, [setCurrentTime, setDuration, audioPlayer])
  useRequestAnimationFrame(handleAnimationFrame)
  return [currentTime, duration]
}

export interface AudioPlayerActions {
  setUrl: (url: Option<Url>) => void
  play: () => Promise<void>
  pause: () => void
  seek: (time: Seconds) => void
}

export const useAudioPlayerActions = (): AudioPlayerActions => useAudioPlayer()
