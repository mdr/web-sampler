import { Navbar } from './NavBar.tsx'
import { AudioRecorder, AudioRecorderState } from '../audio/AudioRecorder.ts'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../utils/utils.ts'
import { RecordButton } from './RecordButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'
import { useRequestAnimationFrame } from '../utils/hooks.ts'
import { StopButton } from './StopButton.tsx'

export const CapturePage = () => {
  const audioRecorderRef = useRef<AudioRecorder | undefined>()
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(AudioRecorderState.IDLE)
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined)
  const [volume, setVolume] = useState<number>(0)
  const handleRecordingComplete = (audio: Blob) => {
    const url = URL.createObjectURL(audio)
    setAudioUrl(url)
  }

  useEffect(() => {
    const audioRecorder = new AudioRecorder()
    audioRecorder.addStateChangeListener(setAudioRecorderState)
    audioRecorder.addRecordingCompleteListener(handleRecordingComplete)
    audioRecorderRef.current = audioRecorder
  }, [])

  useRequestAnimationFrame(() => {
    const audioRecorder = audioRecorderRef.current
    if (audioRecorder) {
      setVolume(audioRecorder.volume)
    }
  })

  const handleRecordButtonPressed = () => {
    setAudioUrl(undefined)
    const audioRecorder = audioRecorderRef.current
    if (audioRecorder) {
      unawaited(audioRecorder.startRecording())
    }
  }

  const handleStopButtonPressed = () => {
    const audioRecorder = audioRecorderRef.current
    if (audioRecorder) {
      audioRecorder.stopRecording()
    }
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
