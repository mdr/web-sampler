import { Navbar } from './NavBar.tsx'
import { AudioRecorder, AudioRecorderState } from '../audio/AudioRecorder.ts'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../utils/utils.ts'
import { RecordButton } from './RecordButton.tsx'

export const CapturePage = () => {
  const audioRecorderRef = useRef<AudioRecorder | undefined>()
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(AudioRecorderState.IDLE)
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined)

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

  const sampleAudio = () => {
    const audioRecorder = audioRecorderRef.current
    if (audioRecorder) {
      unawaited(audioRecorder.startRecording())
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center space-x-4 p-4">
        <RecordButton onPress={sampleAudio} enabled={audioRecorderState === AudioRecorderState.IDLE}>
          Sample
        </RecordButton>
        <div>{audioUrl && <audio src={audioUrl} controls />}</div>
      </div>
    </>
  )
}
