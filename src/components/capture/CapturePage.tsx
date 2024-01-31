import { Navbar } from '../Navbar.tsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { useObjectUrlCreator, useRequestAnimationFrame } from '../../utils/hooks.ts'
import { StopButton } from './StopButton.tsx'
import { Url } from '../../utils/types/Url.ts'
import { CapturePageTestIds } from './CapturePage.testIds.ts'
import { AudioRecorderState } from '../../audio/IAudioRecorder.ts'
import { Option } from '../../utils/types/Option.ts'
import { useAudioRecorder } from '../../audio/AudioRecorderContext.ts'
import useUnmount from 'beautiful-react-hooks/useUnmount'
import { TimerId } from '../../utils/types/TimerId.ts'
import { MAX_RECORDING_DURATION } from './captureConstants.ts'
import { toast } from 'react-toastify'

export const CapturePage = () => {
  const audioRecorder = useAudioRecorder()
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(audioRecorder.state)
  const [audioUrl, setAudioUrl] = useState<Option<Url>>(undefined)
  const [volume, setVolume] = useState<number>(0)
  const createObjectUrl = useObjectUrlCreator()
  const timerIdRef = useRef<Option<TimerId>>()

  const handleRecordingComplete = useCallback(
    (audio: Blob) => {
      setAudioUrl(createObjectUrl(audio))
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    },
    [createObjectUrl],
  )

  useEffect(() => {
    audioRecorder.addStateChangeListener(setAudioRecorderState)
    audioRecorder.addRecordingCompleteListener(handleRecordingComplete)
    return () => {
      audioRecorder.removeStateChangeListener(setAudioRecorderState)
      audioRecorder.removeRecordingCompleteListener(handleRecordingComplete)
    }
  }, [audioRecorder, handleRecordingComplete])

  useUnmount(() => {
    if (audioRecorder.state === AudioRecorderState.RECORDING) {
      audioRecorder.stopRecording()
    }
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }
  })

  useRequestAnimationFrame(() => {
    setVolume(audioRecorder.volume)
  })

  const handleRecordButtonPressed = async (): Promise<void> => {
    setAudioUrl(undefined)
    const isRecording = await audioRecorder.startRecording()
    if (isRecording) {
      timerIdRef.current = setTimeout(() => audioRecorder.stopRecording(), MAX_RECORDING_DURATION.toMillis())
    } else {
      toast.error('Unable to start recording')
    }
  }

  const handleStopButtonPressed = () => audioRecorder.stopRecording()

  return (
    <>
      <Navbar />
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
        {audioRecorderState === AudioRecorderState.RECORDING && <VolumeMeter volume={volume} />}
      </div>
    </>
  )
}
