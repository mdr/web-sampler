import { EditSoundPaneTestIds } from '../EditSoundPaneTestIds.ts'
import { useCallback, useEffect } from 'react'
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

  const { startTime, finishTime, pcm } = sound.audio
  const currentPosition = Seconds(currentAudioPlayerPosition + startTime)
  const totalAudioDuration = getTotalAudioDuration(sound.audio)

  const audioContext = useAudioContext()
  useEffect(() => {
    const pcm = getPlayRegionPcm(sound.audio)
    if (pcm.length === 0) {
      audioPlayerActions.setUrl(undefined)
      return
    }
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.pcmToWavBlob(pcm)
    const objectUrl = Url(URL.createObjectURL(blob))
    audioPlayerActions.setUrl(objectUrl)
    return () => {
      audioPlayerActions.setUrl(undefined)
      URL.revokeObjectURL(objectUrl)
    }
  }, [audioContext, sound.audio, audioPlayerActions])

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

  const markStart = () => {
    soundActions.setStartTime(sound.id, currentPosition)
  }
  useHotkeys('s', markStart, [markStart])

  const markFinish = () => {
    soundActions.setFinishTime(sound.id, currentPosition)
  }
  useHotkeys('f', markFinish, [markFinish])

  const handleStartTimeChange = useCallback(
    (startTime: Seconds) => soundActions.setStartTime(sound.id, startTime),
    [soundActions, sound.id],
  )

  const handleFinishTimeChange = useCallback(
    (finishTime: Seconds) => soundActions.setFinishTime(sound.id, finishTime),
    [soundActions, sound.id],
  )

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser
        startTime={startTime}
        currentPosition={currentPosition}
        finishTime={finishTime}
        audioDuration={totalAudioDuration}
        pcm={pcm}
        onPositionChange={seek}
        onStartTimeChanged={handleStartTimeChange}
        onFinishTimeChanged={handleFinishTimeChange}
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
