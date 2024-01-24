import { Navbar } from '../Navbar.tsx'
import { useCallback, useEffect, useState } from 'react'
import { unawaited } from '../../utils/utils.ts'
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

export const CapturePage = () => {
  const audioRecorder = useAudioRecorder()
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(audioRecorder.state)
  const [audioUrl, setAudioUrl] = useState<Option<Url>>(undefined)
  const [volume, setVolume] = useState<number>(0)
  const createObjectUrl = useObjectUrlCreator()

  const handleRecordingComplete = useCallback((audio: Blob) => setAudioUrl(createObjectUrl(audio)), [createObjectUrl])

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
  })

  useRequestAnimationFrame(() => {
    setVolume(audioRecorder.volume)
  })

  const handleRecordButtonPressed = () => {
    setAudioUrl(undefined)
    unawaited(audioRecorder.startRecording())
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
        <div>{audioUrl && <audio src={audioUrl} controls />}</div>
        {audioRecorderState === AudioRecorderState.RECORDING && <VolumeMeter volume={volume} />}
      </div>
    </>
  )
}
