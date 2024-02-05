import { useCallback, useRef } from 'react'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { StopButton } from './StopButton.tsx'
import { EditSoundPageTestIds } from './EditSoundPage.testIds.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../audio/AudioRecorder.ts'
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
} from '../../audio/audioRecorderHooks.ts'
import { useSound, useSoundActions } from '../../sounds/soundHooks.ts'
import { SoundId } from '../../types/Sound.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { AudioSection } from './AudioSection.tsx'

export interface EditSoundPageProps {
  soundId: SoundId
}

export const EditSoundPageContents = ({ soundId }: EditSoundPageProps) => {
  const sound = useSound(soundId)
  const soundActions = useSoundActions()
  const audioRecorderActions = useAudioRecorderActions()
  const audioRecorderState = useAudioRecorderState()

  const timerIdRef = useRef<Option<TimerId>>()

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
        case StartRecordingOutcome.PERMISSION_DENIED:
          break
        case StartRecordingOutcome.NO_AUDIO_TRACK:
          toast.error('No audio available in selected input')
          break
      }
    })

  const handleStopButtonPressed = () => audioRecorderActions.stopRecording()

  const setSoundName = (name: string) => soundActions.setName(soundId, name)

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
            <StopButton testId={EditSoundPageTestIds.stopButton} onPress={handleStopButtonPressed}>
              Stop
            </StopButton>
            <VolumeMeter />
          </>
        )}
      </div>
    </>
  )
}
