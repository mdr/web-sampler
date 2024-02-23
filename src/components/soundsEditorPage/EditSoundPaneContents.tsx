import { useCallback, useRef } from 'react'
import { CaptureAudioButton } from './CaptureAudioButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { StopButton } from './StopButton.tsx'
import { AudioRecorderState, StartRecordingOutcome } from '../../audioRecorder/AudioRecorder.ts'
import { Option } from '../../utils/types/Option.ts'
import useUnmount from 'beautiful-react-hooks/useUnmount'
import { TimerId } from '../../utils/types/TimerId.ts'
import { MAX_RECORDING_DURATION } from './recordingConstants.ts'
import { toast } from 'react-toastify'
import { SoundNameTextField } from './SoundNameTextField.tsx'
import {
  useAudioRecorderActions,
  useAudioRecorderState,
  useAudioRecordingComplete,
} from '../../audioRecorder/audioRecorderHooks.ts'
import { useSound, useSoundActions } from '../../sounds/soundHooks.ts'
import { getDisplayName, soundHasAudio, SoundId } from '../../types/Sound.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { AudioSection } from './audioSection/AudioSection.tsx'
import { DeleteButton } from './DeleteButton.tsx'
import { useNavigate } from 'react-router-dom'
import { Pcm } from '../../utils/types/brandedTypes.ts'
import { DownloadWavButton } from './audioSection/DownloadWavButton.tsx'
import { CropButton } from './audioSection/CropButton.tsx'
import { getPlayableAudioDuration } from '../../types/SoundAudio.ts'
import humanizeDuration from 'humanize-duration'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import Bowser from 'bowser'
import { DuplicateSoundButton } from './DuplicateSoundButton.tsx'

const durationHumanizer = humanizeDuration.humanizer({
  units: ['s'],
  maxDecimalPoints: 1,
})

export interface EditSoundPageProps {
  soundId: SoundId
}

// https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_audio_capture_support
const canCaptureAudioFromDisplayMedia = (): boolean =>
  Bowser.getParser(window.navigator.userAgent).satisfies({
    desktop: {
      chrome: '>=74',
      edge: '>=79',
      opera: '>=62',
    },
  }) ?? false

export const EditSoundPaneContents = ({ soundId }: EditSoundPageProps) => {
  const sound = useSound(soundId)
  const soundActions = useSoundActions()
  const audioRecorderActions = useAudioRecorderActions()
  const audioRecorderState = useAudioRecorderState()
  const timerIdRef = useRef<Option<TimerId>>()
  const navigate = useNavigate()

  const handleRecordingComplete = useCallback(
    (audio: Option<Pcm>) => {
      if (audio === undefined) {
        toast.error('No audio captured')
      } else {
        soundActions.setAudioPcm(sound.id, audio)
      }
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    },
    [soundActions, sound],
  )

  useAudioRecordingComplete(handleRecordingComplete)

  useUnmount(() => {
    audioRecorderActions.stopRecording()
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }
  })

  const handleCaptureAudioButtonPressed = () =>
    fireAndForget(async () => {
      const outcome = await audioRecorderActions.startRecording()
      switch (outcome) {
        case StartRecordingOutcome.SUCCESS:
          timerIdRef.current = setTimeout(() => audioRecorderActions.stopRecording(), MAX_RECORDING_DURATION.toMillis())
          break
        case StartRecordingOutcome.CANCELLED_BY_USER:
          break
        case StartRecordingOutcome.NO_AUDIO_TRACK:
          toast.error('No audio available in selected input')
          break
      }
    })

  const handleStopButtonPressed = () => audioRecorderActions.stopRecording()

  const setSoundName = (name: string) => soundActions.setName(soundId, name)

  const handleDeleteButtonPressed = () => {
    soundActions.deleteSound(soundId)
    navigate('/')
    toast.info(`Deleted sound ${getDisplayName(sound)}`)
  }

  const audio = sound.audio

  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundNameTextField soundName={sound.name} setSoundName={setSoundName} />
      <div className="flex space-x-2">
        <DeleteButton onPress={handleDeleteButtonPressed} />
        <DuplicateSoundButton soundId={sound.id} />
      </div>
      <h2 className="text-2xl" data-testid={EditSoundPaneTestIds.audioHeading}>
        Audio
        {audio !== undefined && <> ({durationHumanizer(getPlayableAudioDuration(audio) * 1000)})</>}
      </h2>
      {audioRecorderState === AudioRecorderState.IDLE && (
        <>
          <div className="flex space-x-2">
            {canCaptureAudioFromDisplayMedia() && <CaptureAudioButton onPress={handleCaptureAudioButtonPressed} />}
            {soundHasAudio(sound) && getPlayableAudioDuration(sound.audio) > 0 && <DownloadWavButton sound={sound} />}
            {audio !== undefined && <CropButton soundId={sound.id} />}
          </div>
          {soundHasAudio(sound) && <AudioSection sound={sound} />}
        </>
      )}
      {audioRecorderState === AudioRecorderState.RECORDING && (
        <div className="flex items-center space-x-4">
          <StopButton onPress={handleStopButtonPressed} />
          <VolumeMeter />
        </div>
      )}
    </div>
  )
}
