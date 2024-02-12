import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { WaveformVisualiser } from './WaveformVisualiser.tsx'
import { useEffect } from 'react'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { Seconds, Url } from '../../utils/types/brandedTypes.ts'
import Icon from '@mdi/react'
import { mdiPause, mdiPlay } from '@mdi/js'
import { Button } from 'react-aria-components'
import { unawaited } from '../../utils/utils.ts'
import {
  useAudioPlayerActions,
  useAudioPlayerCurrentTimeAndDurationRaf,
  useAudioPlayerIsPlaying,
} from '../../audioPlayer/audioPlayerHooks.ts'
import { SoundAudio, SoundId } from '../../types/Sound.ts'
import { useSoundActions } from '../../sounds/soundHooks.ts'

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
      <WaveformVisualiser
        key={soundId}
        audio={audio}
        currentPosition={currentPosition}
        audioDuration={audioDuration}
        onPositionChange={handlePositionChange}
        onStartTimeChange={handleStartTimeChange}
        onFinishTimeChange={handleFinishTimeChange}
      />
      <Button
        onPress={togglePlayPause}
        className="mt-4 flex items-center justify-center rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        data-testid={isPlaying ? EditSoundPaneTestIds.pauseButton : EditSoundPaneTestIds.playButton}
      >
        <Icon path={isPlaying ? mdiPause : mdiPlay} size={1} />
      </Button>
    </div>
  )
}
