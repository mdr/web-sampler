import { EditSoundPaneTestIds } from '../EditSoundPaneTestIds.ts'
import { useCallback, useEffect } from 'react'
import { AudioBufferUtils } from '../../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../../audioRecorder/AudioContextProvider.ts'
import { Seconds, Url } from '../../../utils/types/brandedTypes.ts'
import { mdiPause, mdiPlay } from '@mdi/js'
import { unawaited } from '../../../utils/utils.ts'
import {
  useAudioPlayerActions,
  useAudioPlayerCurrentTimeAndDurationRaf,
  useAudioPlayerIsPlaying,
} from '../../../audioPlayer/audioPlayerHooks.ts'
import { SoundId } from '../../../types/Sound.ts'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { Button } from '../../shared/Button.tsx'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { useHotkeys } from 'react-hotkeys-hook'
import { SoundAudio } from '../../../types/SoundAudio.ts'

const BIG_SEEK_JUMP = Seconds(0.5)
const SMALL_SEEK_JUMP = Seconds(0.1)

export interface AudioSectionProps {
  soundId: SoundId
  audio: SoundAudio
}

export const AudioSection = ({ soundId, audio }: AudioSectionProps) => {
  const [currentPosition, audioDuration] = useAudioPlayerCurrentTimeAndDurationRaf()
  const audioPlayerActions = useAudioPlayerActions()
  const isPlaying = useAudioPlayerIsPlaying()
  const soundActions = useSoundActions()

  const pcm = audio.pcm

  const { startTime, finishTime } = audio

  useEffect(() => {
    if (currentPosition >= finishTime) {
      audioPlayerActions.pause()
      audioPlayerActions.seek(finishTime)
    }
  }, [currentPosition, finishTime, audioPlayerActions])

  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.pcmToWavBlob(pcm)
    const objectUrl = Url(URL.createObjectURL(blob))
    audioPlayerActions.setUrl(objectUrl)
    return () => {
      audioPlayerActions.pause()
      audioPlayerActions.setUrl(undefined)
      URL.revokeObjectURL(objectUrl)
    }
  }, [audioContext, audioPlayerActions, pcm])

  useEffect(() => {
    audioPlayerActions.setPlayWindow({ start: startTime, finish: finishTime })
  }, [audioPlayerActions, startTime, finishTime])

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPlayerActions.pause()
    } else {
      unawaited(audioPlayerActions.play())
    }
  }
  useHotkeys('space', togglePlayPause, [togglePlayPause])

  const seekBack = (amount: Seconds) => () => {
    audioPlayerActions.seek(Seconds(currentPosition - amount))
  }
  useHotkeys('left', seekBack(BIG_SEEK_JUMP), [seekBack])
  useHotkeys('shift+left', seekBack(SMALL_SEEK_JUMP), [seekBack])

  const seekForward = (amount: Seconds) => () => {
    audioPlayerActions.seek(Seconds(currentPosition + amount))
  }
  useHotkeys('right', seekForward(BIG_SEEK_JUMP), [seekForward])
  useHotkeys('shift+right', seekForward(SMALL_SEEK_JUMP), [seekForward])

  const markStart = () => {
    soundActions.setStartTime(soundId, currentPosition)
  }
  useHotkeys('s', markStart, [markStart])

  const markFinish = () => {
    soundActions.setFinishTime(soundId, currentPosition)
  }
  useHotkeys('f', markFinish, [markFinish])

  const handlePositionChange = useCallback(
    (position: Seconds) => audioPlayerActions.seek(position),
    [audioPlayerActions],
  )

  const handleStartTimeChange = useCallback(
    (startTime: Seconds) => soundActions.setStartTime(soundId, startTime),
    [soundActions, soundId],
  )

  const handleFinishTimeChange = useCallback(
    (finishTime: Seconds) => soundActions.setFinishTime(soundId, finishTime),
    [soundActions, soundId],
  )

  return (
    <div className="flex flex-col items-center">
      <WaveformVisualiser
        startTime={startTime}
        currentPosition={currentPosition}
        finishTime={finishTime}
        audioDuration={audioDuration}
        pcm={audio.pcm}
        onPositionChange={handlePositionChange}
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
