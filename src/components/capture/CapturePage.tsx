import { Navbar } from '../NavBar.tsx'
import { AudioRecorder, AudioRecorderState } from '../../audio/AudioRecorder.ts'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../../utils/utils.ts'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { useObjectUrlCreator, useRequestAnimationFrame } from '../../utils/hooks.ts'
import { StopButton } from './StopButton.tsx'
import { Url } from '../../utils/Url.ts'

export const CapturePage = () => {
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(AudioRecorderState.IDLE)
  const [audioUrl, setAudioUrl] = useState<Url | undefined>(undefined)
  const [volume, setVolume] = useState<number>(0)
  const createObjectUrl = useObjectUrlCreator()

  const handleRecordingComplete = (audio: Blob) => {
    setAudioUrl(createObjectUrl(audio))
  }

  const audioRecorderRef = useRef<AudioRecorder>(new AudioRecorder())
  useEffect(() => {
    const audioRecorder = audioRecorderRef.current
    audioRecorder.addStateChangeListener(setAudioRecorderState)
    audioRecorder.addRecordingCompleteListener(handleRecordingComplete)
    audioRecorderRef.current = audioRecorder
    return audioRecorder.dispose
  }, [])

  useRequestAnimationFrame(() => {
    setVolume(audioRecorderRef.current.volume)
  })

  const handleRecordButtonPressed = () => {
    setAudioUrl(undefined)
    unawaited(audioRecorderRef.current.startRecording())
  }

  const handleStopButtonPressed = () => {
    audioRecorderRef.current.stopRecording()
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center space-x-4 p-4">
        {audioRecorderState === AudioRecorderState.IDLE && (
          <RecordButton onPress={handleRecordButtonPressed}>Record</RecordButton>
        )}
        {audioRecorderState === AudioRecorderState.RECORDING && (
          <StopButton onPress={handleStopButtonPressed}>Stop</StopButton>
        )}
        <div>{audioUrl && <audio src={audioUrl} controls />}</div>
        {audioRecorderState === AudioRecorderState.RECORDING && <VolumeMeter volume={volume} />}
      </div>
    </>
  )
}
