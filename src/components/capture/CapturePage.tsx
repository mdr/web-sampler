import { Navbar } from '../Navbar.tsx'
import { useCallback, useRef, useState } from 'react'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { useObjectUrlCreator } from '../../utils/hooks.ts'
import { StopButton } from './StopButton.tsx'
import { Url } from '../../utils/types/Url.ts'
import { CapturePageTestIds } from './CapturePage.testIds.ts'
import { AudioRecorderState, StartRecordingOutcome } from '../../audio/IAudioRecorder.ts'
import { Option } from '../../utils/types/Option.ts'
import useUnmount from 'beautiful-react-hooks/useUnmount'
import { TimerId } from '../../utils/types/TimerId.ts'
import { MAX_RECORDING_DURATION } from './captureConstants.ts'
import { toast } from 'react-toastify'
import { WaveformVisualiser } from '../../audio/WaveformVisualiser.tsx'
import { SoundNameTextField } from './SoundNameTextField.tsx'
import {
  useAudioRecorderActions,
  useAudioRecorderState,
  useAudioRecorderVolume,
  useAudioRecordingComplete,
} from '../../audio/audioRecorderHooks.ts'

export const CapturePage = () => {
  const audioRecorderActions = useAudioRecorderActions()
  const [soundName, setSoundName] = useState('')
  const audioRecorderState = useAudioRecorderState()
  const volume = useAudioRecorderVolume()
  const [audioUrl, setAudioUrl] = useState<Option<Url>>(undefined)
  const [audioBuffer, setAudioBuffer] = useState<Option<AudioBuffer>>(undefined)
  const createObjectUrl = useObjectUrlCreator()
  const timerIdRef = useRef<Option<TimerId>>()

  const handleRecordingComplete = useCallback(
    (buffer: AudioBuffer, audioBlob: Blob) => {
      setAudioUrl(createObjectUrl(audioBlob))
      setAudioBuffer(buffer)
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    },
    [createObjectUrl],
  )
  useAudioRecordingComplete(handleRecordingComplete)

  useUnmount(() => {
    if (audioRecorderState === AudioRecorderState.RECORDING) {
      audioRecorderActions.stopRecording()
    }
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }
  })

  const handleRecordButtonPressed = async (): Promise<void> => {
    const outcome = await audioRecorderActions.startRecording()
    switch (outcome) {
      case StartRecordingOutcome.SUCCESS:
        setAudioUrl(undefined)
        setAudioBuffer(undefined)
        timerIdRef.current = setTimeout(() => audioRecorderActions.stopRecording(), MAX_RECORDING_DURATION.toMillis())
        break
      case StartRecordingOutcome.PERMISSION_DENIED:
        break
      case StartRecordingOutcome.NO_AUDIO_TRACK:
        toast.error('No audio available in selected input')
        break
    }
  }

  const handleStopButtonPressed = () => audioRecorderActions.stopRecording()

  return (
    <>
      <Navbar />
      <SoundNameTextField soundName={soundName} setSoundName={setSoundName} />
      <div className="flex items-center space-x-4 p-4">
        {audioRecorderState === AudioRecorderState.IDLE && (
          <RecordButton testId={CapturePageTestIds.recordButton} onPress={handleRecordButtonPressed}>
            Record
          </RecordButton>
        )}
        {audioRecorderState === AudioRecorderState.RECORDING && (
          <StopButton testId={CapturePageTestIds.stopButton} onPress={handleStopButtonPressed}>
            Stop
          </StopButton>
        )}
        <div>{audioUrl && <audio data-testid={CapturePageTestIds.audioElement} src={audioUrl} controls />}</div>
        {audioBuffer && <WaveformVisualiser audioBuffer={audioBuffer} />}
        {audioRecorderState === AudioRecorderState.RECORDING && <VolumeMeter volume={volume} />}
      </div>
    </>
  )
}
