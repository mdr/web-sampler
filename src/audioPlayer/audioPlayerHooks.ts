import { useCallback, useContext, useEffect, useState } from 'react'
import { AudioPlayer } from './AudioPlayer.ts'
import { AudioPlayerContext } from './AudioPlayerContext.ts'
import { Seconds, Url } from '../utils/types/brandedTypes.ts'
import { useRequestAnimationFrame } from '../utils/hooks/useRequestAnimationFrame.ts'

const useAudioPlayer = (): AudioPlayer => {
  const audioPlayer = useContext(AudioPlayerContext)
  if (audioPlayer === undefined) {
    throw new Error('no AudioPlayer available in context')
  }
  return audioPlayer
}

export const useAudioPlayerIsPlaying = (): boolean => {
  const audioPlayer = useAudioPlayer()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const handlePlay = useCallback(() => setIsPlaying(true), [setIsPlaying])
  const handlePause = useCallback(() => setIsPlaying(false), [setIsPlaying])
  const handleEnded = useCallback(() => setIsPlaying(false), [setIsPlaying])
  useEffect(() => {
    audioPlayer.addPlayListener(handlePlay)
    audioPlayer.addPauseListener(handlePause)
    audioPlayer.addEndedListener(handleEnded)
    return () => {
      audioPlayer.removePlayListener(handlePlay)
      audioPlayer.removePauseListener(handlePause)
      audioPlayer.removeEndedListener(handleEnded)
    }
  }, [audioPlayer, setIsPlaying, handlePlay, handlePause, handleEnded])
  return isPlaying
}

export const useAudioPlayerCurrentTimeAndDuration = (): [Seconds, Seconds] => {
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
  setUrl: (url: Url) => void
  play: () => Promise<void>
  pause: () => void
  seek: (time: Seconds) => void
}

export const useAudioPlayerActions = (): AudioPlayerActions => useAudioPlayer()
