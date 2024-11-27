import useUnmount from 'beautiful-react-hooks/useUnmount'
import { useCallback, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  useAudioPlayerActions,
  useAudioPlayerCurrentTimeRaf,
  useAudioPlayerIsPlaying,
} from '../../../audioPlayer/audioPlayerHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { getFinishTime, getPlayRegionPcm, getStartTime, getTotalAudioDuration } from '../../../types/SoundAudio.ts'
import { samplesToSeconds, secondsToSamples } from '../../../types/sampleConversions.ts'
import { pcmSlice } from '../../../utils/pcmUtils.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Samples, Seconds, Url } from '../../../utils/types/brandedTypes.ts'
import { unawaited } from '../../../utils/utils.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'
import { PauseButton } from './PauseButton.tsx'
import { PlayButton } from './PlayButton.tsx'
import { VolumeSlider } from './VolumeSlider.tsx'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'

const BIG_SEEK_JUMP = Seconds(0.5)
const SMALL_SEEK_JUMP = Seconds(0.1)

export interface AudioSectionProps {
  sound: SoundWithDefiniteAudio
}

export const AudioSection = ({ sound }: AudioSectionProps) => {
  const currentAudioPlayerPosition = useAudioPlayerCurrentTimeRaf()
  const audioPlayerActions = useAudioPlayerActions()
  const isPlaying = useAudioPlayerIsPlaying()
  const soundActions = useSoundActions()

  // Keep track of position and playback state when audio boundaries are changed:
  const stashedTimeRef = useRef<Option<Seconds>>(undefined)
  const stashedIsPlayingRef = useRef<Option<boolean>>(undefined)

  const { pcm, sampleRate, volume } = sound.audio
  const startTime = getStartTime(sound.audio)
  const finishTime = getFinishTime(sound.audio)

  const currentPosition = Seconds(currentAudioPlayerPosition + startTime)
  const totalAudioDuration = getTotalAudioDuration(sound.audio)

  useEffect(() => {
    audioPlayerActions.setVolume(volume)
  }, [audioPlayerActions, volume])

  useEffect(() => {
    const playablePcm = pcmSlice(pcm, secondsToSamples(startTime, sampleRate), secondsToSamples(finishTime, sampleRate))
    const stashedTime = stashedTimeRef.current
    stashedTimeRef.current = undefined
    const wasPlaying = stashedIsPlayingRef.current
    stashedIsPlayingRef.current = undefined
    if (playablePcm.length === 0) {
      audioPlayerActions.setUrl(undefined)
      return
    }
    const audioData = { pcm: playablePcm, sampleRate }
    const wavBlob = pcmToWavBlob(audioData)
    const audioUrl = Url(URL.createObjectURL(wavBlob))
    audioPlayerActions.setUrl(audioUrl)
    console.log('main effect', { stashedTime, wasPlaying })
    if (stashedTime !== undefined) {
      if (stashedTime <= finishTime) {
        audioPlayerActions.seek(Seconds(Math.max(0, stashedTime - startTime)))
        if (wasPlaying) {
          unawaited(audioPlayerActions.play())
        }
      }
    }
    return () => {
      URL.revokeObjectURL(audioUrl)
    }
  }, [startTime, finishTime, pcm, audioPlayerActions, sampleRate])

  useUnmount(() => {
    audioPlayerActions.setUrl(undefined)
  })

  const seek = useCallback(
    (position: Seconds) => {
      const playRegionSamples = Samples(getPlayRegionPcm(sound.audio).length)
      const strictFinishTime = startTime + samplesToSeconds(playRegionSamples, sampleRate)
      const clampedPosition = Math.min(Math.max(position, startTime), strictFinishTime)
      const seekPosition = Seconds(clampedPosition - startTime)
      audioPlayerActions.seek(seekPosition)
    },
    [audioPlayerActions, sampleRate, sound.audio, startTime],
  )

  const seekBack = (amount: Seconds) =>
    useCallback(() => seek(Seconds(currentPosition - amount)), [seek, currentPosition])
  useHotkeys('left', seekBack(BIG_SEEK_JUMP), [seekBack])
  useHotkeys('shift+left', seekBack(SMALL_SEEK_JUMP), [seekBack])

  const seekForward = (amount: Seconds) =>
    useCallback(() => seek(Seconds(currentPosition + amount)), [seek, currentPosition])
  useHotkeys('right', seekForward(BIG_SEEK_JUMP), [seekForward])
  useHotkeys('shift+right', seekForward(SMALL_SEEK_JUMP), [seekForward])

  const setStartTime = useCallback(
    (startTime: Seconds) => {
      console.log('setStartTime', { isPlaying })
      stashedTimeRef.current = currentPosition
      stashedIsPlayingRef.current = isPlaying
      soundActions.setAudioStart(sound.id, secondsToSamples(startTime, sampleRate))
    },
    [currentPosition, isPlaying, soundActions, sound.id, sampleRate],
  )

  const setFinishTime = useCallback(
    (finishTime: Seconds) => {
      stashedTimeRef.current = currentPosition
      stashedIsPlayingRef.current = isPlaying
      soundActions.setAudioFinish(sound.id, secondsToSamples(finishTime, sampleRate))
    },
    [currentPosition, isPlaying, soundActions, sound.id, sampleRate],
  )

  const markStart = useCallback(() => setStartTime(currentPosition), [currentPosition, setStartTime])
  useHotkeys('s', markStart, [markStart])

  const markFinish = useCallback(() => setFinishTime(currentPosition), [currentPosition, setFinishTime])
  useHotkeys('f', markFinish, [markFinish])

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser
        startTime={startTime}
        currentPosition={currentPosition}
        finishTime={finishTime}
        audioDuration={totalAudioDuration}
        pcm={pcm}
        onPositionChange={seek}
        onStartTimeChanged={setStartTime}
        onFinishTimeChanged={setFinishTime}
      />
      <div className="mt-4">{isPlaying ? <PauseButton /> : <PlayButton />}</div>
      <VolumeSlider volume={volume} onVolumeChange={(volume) => soundActions.setVolume(sound.id, volume)} />
    </div>
  )
}
