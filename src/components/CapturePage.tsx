import { Navbar } from './NavBar.tsx'
import { PrimaryButton } from './PrimaryButton.tsx'
import { AudioRecorder, AudioRecorderState } from '../AudioRecorder.ts'
import { useEffect, useRef, useState } from 'react'
import { unawaited } from '../utils.ts'

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
        <PrimaryButton onPress={sampleAudio} enabled={audioRecorderState === AudioRecorderState.IDLE}>
          Sample
        </PrimaryButton>
      </div>
    </>
  )
}
