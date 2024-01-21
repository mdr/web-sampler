import { Navbar } from './NavBar.tsx'
import { AudioRecorder, AudioRecorderState } from '../audio/AudioRecorder.ts'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../utils/utils.ts'
import { RecordButton } from './RecordButton.tsx'

export const CapturePage = () => {
  const audioRecorderRef = useRef<AudioRecorder | undefined>()
  const [audioRecorderState, setAudioRecorderState] = useState<AudioRecorderState>(AudioRecorderState.IDLE)

  useEffect(() => {
    const audioRecorder = new AudioRecorder()
    audioRecorder.addStateChangeListener(setAudioRecorderState)
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
      <div className="flex items-baseline space-x-4 p-4">
        <RecordButton onPress={sampleAudio} enabled={audioRecorderState === AudioRecorderState.IDLE}>
          Sample
        </RecordButton>
      </div>
    </>
  )
}
