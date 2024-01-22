import { Navbar } from '../Navbar.tsx'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../../utils/utils.ts'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { useObjectUrlCreator, useRequestAnimationFrame } from '../../utils/hooks.ts'
import { StopButton } from './StopButton.tsx'
import { Url } from '../../utils/types/Url.ts'
import { CapturePageTestIds } from './CapturePage.testIds.ts'
import { AudioRecorderState, IAudioRecorder } from '../../audio/IAudioRecorder.ts'
import { Option } from '../../utils/types/Option.ts'
import { useAudioRecorderFactory } from '../../audio/AudioRecorderFactoryContext.ts'

export const CapturePage = () => {
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(AudioRecorderState.IDLE)
  const [audioUrl, setAudioUrl] = useState<Option<Url>>(undefined)
  const [volume, setVolume] = useState<number>(0)
  const audioRecorderFactory = useAudioRecorderFactory()
  const createObjectUrl = useObjectUrlCreator()

  const handleRecordingComplete = (audio: Blob) => setAudioUrl(createObjectUrl(audio))

  const audioRecorderRef = useRef<IAudioRecorder>(audioRecorderFactory())
  useEffect(() => {
    const audioRecorder = audioRecorderRef.current
    audioRecorder.addStateChangeListener(setAudioRecorderState)
    audioRecorder.addRecordingCompleteListener(handleRecordingComplete)
    return audioRecorder.dispose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRequestAnimationFrame(() => {
    setVolume(audioRecorderRef.current.volume)
  })

  const handleRecordButtonPressed = () => {
    setAudioUrl(undefined)
    unawaited(audioRecorderRef.current.startRecording())
  }

  const handleStopButtonPressed = () => audioRecorderRef.current.stopRecording()

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
          <StopButton data-testid={CapturePageTestIds.stopButton} onPress={handleStopButtonPressed}>
            Stop
          </StopButton>
        )}
        <div>{audioUrl && <audio src={audioUrl} controls />}</div>
        {audioRecorderState === AudioRecorderState.RECORDING && <VolumeMeter volume={volume} />}
      </div>
    </>
  )
}
