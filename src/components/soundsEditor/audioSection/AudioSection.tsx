import { useCallback, useEffect, useRef } from 'react'
import { AudioBufferUtils } from '../../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../../audioRecorder/AudioContextProvider.ts'
import { Seconds, Url } from '../../../utils/types/brandedTypes.ts'
import { mdiPause, mdiPlay } from '@mdi/js'
import { unawaited } from '../../../utils/utils.ts'
import {
  useAudioPlayerActions,
  useAudioPlayerCurrentTimeRaf,
  useAudioPlayerIsPlaying,
} from '../../../audioPlayer/audioPlayerHooks.ts'
import { DEFAULT_SAMPLE_RATE, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { Button } from '../../shared/Button.tsx'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { useHotkeys } from 'react-hotkeys-hook'
import { getPlayRegionPcm, getTotalAudioDuration } from '../../../types/SoundAudio.ts'
import { Option } from '../../../utils/types/Option.ts'
import useUnmount from 'beautiful-react-hooks/useUnmount'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

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

  const { startTime, finishTime, pcm } = sound.audio
  const currentPosition = Seconds(currentAudioPlayerPosition + startTime)
  const totalAudioDuration = getTotalAudioDuration(sound.audio)

  const audioContext = useAudioContext()
  useEffect(() => {
    const pcm = getPlayRegionPcm(sound.audio)
    const stashedTime = stashedTimeRef.current
    stashedTimeRef.current = undefined
    const wasPlaying = stashedIsPlayingRef.current
    stashedIsPlayingRef.current = undefined
    if (pcm.length === 0) {
      audioPlayerActions.setUrl(undefined)
      return
    }
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.pcmToWavBlob(pcm)
    const objectUrl = Url(URL.createObjectURL(blob))
    audioPlayerActions.setUrl(objectUrl)
    if (stashedTime !== undefined) {
      if (stashedTime <= sound.audio.finishTime) {
        audioPlayerActions.seek(Seconds(Math.max(0, stashedTime - sound.audio.startTime)))
        if (wasPlaying) {
          unawaited(audioPlayerActions.play())
        }
      }
    }
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [audioContext, sound.audio, audioPlayerActions])

  useUnmount(() => {
    audioPlayerActions.setUrl(undefined)
  })

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPlayerActions.pause()
    } else {
      unawaited(audioPlayerActions.play())
    }
  }
  useHotkeys('space', togglePlayPause, [togglePlayPause])

  const seek = useCallback(
    (position: Seconds) => {
      const strictFinishTime = startTime + getPlayRegionPcm(sound.audio).length / DEFAULT_SAMPLE_RATE
      const clampedPosition = Math.min(Math.max(position, startTime), strictFinishTime)
      const seekPosition = Seconds(clampedPosition - startTime)
      audioPlayerActions.seek(seekPosition)
    },
    [audioPlayerActions, sound.audio, startTime],
  )

  const seekBack = (amount: Seconds) => () => seek(Seconds(currentPosition - amount))
  useHotkeys('left', seekBack(BIG_SEEK_JUMP), [seekBack])
  useHotkeys('shift+left', seekBack(SMALL_SEEK_JUMP), [seekBack])

  const seekForward = (amount: Seconds) => () => seek(Seconds(currentPosition + amount))
  useHotkeys('right', seekForward(BIG_SEEK_JUMP), [seekForward])
  useHotkeys('shift+right', seekForward(SMALL_SEEK_JUMP), [seekForward])

  const setStartTime = useCallback(
    (startTime: Seconds) => {
      stashedTimeRef.current = currentPosition
      stashedIsPlayingRef.current = isPlaying
      soundActions.setStartTime(sound.id, startTime)
    },
    [currentPosition, isPlaying, soundActions, sound.id],
  )

  const setFinishTime = useCallback(
    (finishTime: Seconds) => {
      stashedTimeRef.current = currentPosition
      stashedIsPlayingRef.current = isPlaying
      soundActions.setFinishTime(sound.id, finishTime)
    },
    [currentPosition, isPlaying, soundActions, sound.id],
  )

  const markStart = () => setStartTime(currentPosition)
  useHotkeys('s', markStart, [markStart])

  const markFinish = () => setFinishTime(currentPosition)
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
      <div className="mt-4">
        <Button
          testId={isPlaying ? EditSoundPaneTestIds.pauseButton : EditSoundPaneTestIds.playButton}
          icon={isPlaying ? mdiPause : mdiPlay}
          iconOnly
          label={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlayPause}
        />
      </div>
    </div>
  )
}
