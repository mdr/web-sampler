import { EditSoundPaneTestIds } from '../EditSoundPaneTestIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { useEffect } from 'react'
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
import { SoundAudio, SoundId } from '../../../types/Sound.ts'
import { useSoundActions } from '../../../sounds/soundHooks.ts'
import { Button } from '../../shared/Button.tsx'
import { KonvaWaveformVisualiser } from './KonvaWaveformVisualiser.tsx'

const useNew = true

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
  })

  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.pcmToWavBlob(pcm)
    const objectUrl = Url(URL.createObjectURL(blob))
    audioPlayerActions.setUrl(objectUrl)
    return () => {
      audioPlayerActions.pause()
      audioPlayerActions.setUrl(undefined)
    }
  }, [audioContext, audioPlayerActions, pcm])

  useEffect(() => {
    audioPlayerActions.setPlayWindow({ start: startTime, finish: finishTime })
  }, [audioPlayerActions, startTime, finishTime])

  const handlePositionChange = (position: Seconds) => {
    audioPlayerActions.seek(position)
  }

  const handleStartTimeChange = (startTime: Seconds) => {
    soundActions.setStartTime(soundId, startTime)
  }

  const handleFinishTimeChange = (finishTime: Seconds) => {
    soundActions.setFinishTime(soundId, finishTime)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPlayerActions.pause()
    } else {
      unawaited(audioPlayerActions.play())
    }
  }

  return (
    <div className="flex flex-col items-center">
      {useNew && (
        <KonvaWaveformVisualiser
          startTime={startTime}
          currentPosition={currentPosition}
          finishTime={finishTime}
          audioDuration={audioDuration}
          pcm={audio.pcm}
          onStartTimeChanged={handleStartTimeChange}
        />
      )}
      {!useNew && (
        <WaveformVisualiser
          key={soundId}
          audio={audio}
          currentPosition={currentPosition}
          audioDuration={audioDuration}
          onPositionChange={handlePositionChange}
          onStartTimeChange={handleStartTimeChange}
          onFinishTimeChange={handleFinishTimeChange}
        />
      )}
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
