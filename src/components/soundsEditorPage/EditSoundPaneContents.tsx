import { useCallback, useRef } from 'react'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { StopButton } from './StopButton.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
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
import { getDisplayName, SoundId } from '../../types/Sound.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { AudioSection } from './AudioSection.tsx'
import { DeleteButton } from './DeleteButton.tsx'
import { useNavigate } from 'react-router-dom'

export interface EditSoundPageProps {
  soundId: SoundId
}

export const EditSoundPaneContents = ({ soundId }: EditSoundPageProps) => {
  const sound = useSound(soundId)
  const soundActions = useSoundActions()
  const audioRecorderActions = useAudioRecorderActions()
  const audioRecorderState = useAudioRecorderState()
  const timerIdRef = useRef<Option<TimerId>>()
  const navigate = useNavigate()

  const handleRecordingComplete = useCallback(
    (audio: Float32Array) => {
      soundActions.setAudio(sound.id, audio)
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

  const handleRecordButtonPressed = () =>
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

  return (
    <>
      <SoundNameTextField soundName={sound.name} setSoundName={setSoundName} />
      <div className="flex items-center space-x-4 p-4">
        {audioRecorderState === AudioRecorderState.IDLE && (
          <>
            <RecordButton onPress={handleRecordButtonPressed} />
            {sound.audio !== undefined && <AudioSection audio={sound.audio} />}
          </>
        )}
        {audioRecorderState === AudioRecorderState.RECORDING && (
          <>
            <StopButton testId={EditSoundPaneTestIds.stopButton} onPress={handleStopButtonPressed}>
              Stop
            </StopButton>
            <VolumeMeter />
          </>
        )}
        <DeleteButton onPress={handleDeleteButtonPressed} />
      </div>
    </>
  )
}
