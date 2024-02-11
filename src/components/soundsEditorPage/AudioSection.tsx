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
  useAudioPlayerCurrentTimeAndDuration,
  useAudioPlayerIsPlaying,
} from '../../audioPlayer/audioPlayerHooks.ts'
import { SoundAudio } from '../../types/Sound.ts'

export interface AudioSectionProps {
  audio: SoundAudio
}

export const AudioSection = ({ audio }: AudioSectionProps) => {
  const [currentPosition, audioDuration] = useAudioPlayerCurrentTimeAndDuration()
  const audioPlayerActions = useAudioPlayerActions()
  const isPlaying = useAudioPlayerIsPlaying()

  const audioContext = useAudioContext()
  useEffect(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const blob = audioBufferUtils.pcmToWavBlob(audio.pcm)
    const objectUrl = Url(URL.createObjectURL(blob))
    audioPlayerActions.setUrl(objectUrl)
    return () => {
      audioPlayerActions.pause()
      audioPlayerActions.setUrl(undefined)
    }
  }, [audio, audioContext, audioPlayerActions])

  const handlePositionChange = (position: Seconds) => {
    audioPlayerActions.seek(position)
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
        audio={audio}
        currentPosition={currentPosition}
        audioDuration={audioDuration}
        onPositionChange={handlePositionChange}
      />
      <Button
        onPress={togglePlayPause}
        className="mt-4 flex items-center justify-center p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        data-testid={isPlaying ? EditSoundPaneTestIds.pauseButton : EditSoundPaneTestIds.playButton}
      >
        <Icon path={isPlaying ? mdiPause : mdiPlay} size={1} />
      </Button>
    </div>
  )
}
