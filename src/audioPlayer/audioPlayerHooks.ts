import { useCallback, useContext, useEffect, useState } from 'react'

import { useRequestAnimationFrame } from '../utils/hooks/useRequestAnimationFrame.ts'
import { Option } from '../utils/types/Option.ts'
import { Seconds, Url, Volume } from '../utils/types/brandedTypes.ts'
import { AudioPlayer } from './AudioPlayer.ts'
import { AudioPlayerContext } from './AudioPlayerContext.ts'

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
  const handlePlay = useCallback(() => setIsPlaying(true), [])
  const handlePause = useCallback(() => setIsPlaying(false), [])
  const handleEnded = useCallback(() => setIsPlaying(false), [])
  const handleLoadStart = useCallback(() => setIsPlaying(audioPlayer.isPlaying), [audioPlayer.isPlaying])
  useEffect(() => {
    audioPlayer.addPlayListener(handlePlay)
    audioPlayer.addPauseListener(handlePause)
    audioPlayer.addEndedListener(handleEnded)
    audioPlayer.addLoadStartListener(handleLoadStart)
    return () => {
      audioPlayer.removePlayListener(handlePlay)
      audioPlayer.removePauseListener(handlePause)
      audioPlayer.removeEndedListener(handleEnded)
      audioPlayer.removeLoadStartListener(handleLoadStart)
    }
  }, [audioPlayer, handleEnded, handleLoadStart, handlePause, handlePlay])
  return isPlaying
}

export const useAudioPlayerCurrentTimeRaf = (): Seconds => {
  const audioPlayer = useAudioPlayer()
  const [currentTime, setCurrentTime] = useState<Seconds>(audioPlayer.currentTime)
  const handleAnimationFrame = useCallback(() => {
    setCurrentTime(audioPlayer.currentTime)
  }, [audioPlayer])
  useRequestAnimationFrame(handleAnimationFrame)
  return currentTime
}

export interface AudioPlayerActions {
  setUrl: (url: Option<Url>) => void
  setVolume: (volume: Volume) => void
  play: () => Promise<void>
  pause: () => void
  seek: (time: Seconds) => void
}

export const useAudioPlayerActions = (): AudioPlayerActions => useAudioPlayer()
